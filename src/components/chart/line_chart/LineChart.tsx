import { useMemo, useState } from 'react';
import { useColorMode } from '@components';
import { Bar, Line } from 'react-chartjs-2';
import { LineChartProps } from './types';

import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { TimeWindow } from '@store';
import {
  LuChartColumn,
  LuChartLine,
  LuTrendingUp,
  LuCalendarDays,
} from 'react-icons/lu';

type ChartType = 'bar' | 'line';
type LineMode = 'daily' | 'cumulative';

const LineChart = ({
  data,
  width,
  height,
  timeWindow = TimeWindow.MONTH,
}: LineChartProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [lineMode, setLineMode] = useState<LineMode>('daily');

  const gridColor = isDark
    ? 'rgba(255, 255, 255, 0.12)'
    : 'rgba(0, 0, 0, 0.08)';
  const textColor = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
  const activeToggleBg = isDark ? 'whiteAlpha.200' : 'white';
  const inactiveColor = isDark ? 'whiteAlpha.500' : 'blackAlpha.400';

  const monthName = useMemo(() => {
    if (!data?.labels || data.labels.length === 0) return 'Date';
    const firstLabel = data.labels[0] as string;
    const d = new Date(firstLabel);
    if (isNaN(d.getTime())) return 'Date';
    return d.toLocaleString('default', { month: 'long' });
  }, [data]);

  const chartOptions = useMemo(
    () => ({
      maintainAspectRatio: false,
      scales: {
        x: {
          display: true,
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            callback: function (val: number | string) {
              const label =
                typeof val === 'number'
                  ? ((data.labels?.[val] as string) ?? String(val))
                  : val;
              const parts = label.split('-');
              return parts.length === 3 ? parseInt(parts[2], 10) : label;
            },
          },
          title: {
            display: true,
            text: monthName,
            color: textColor,
            font: { size: 14 },
          },
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            callback: function (value: number | string) {
              return '₹' + Number(value).toLocaleString('en-IN');
            },
          },
          title: {
            display: true,
            text: 'Rupees (₹)',
            color: textColor,
            font: { size: 14 },
          },
        },
      },
      elements: {
        line: { tension: 0.35, fill: true },
        point: { radius: 3, hoverRadius: 6 },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#fff',
          bodyColor: '#e2e8f0',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          boxPadding: 4,
          callbacks: {
            title: function (context: any[]) {
              const dateStr = context[0].label;
              const d = new Date(dateStr);
              if (isNaN(d.getTime())) return dateStr;
              return d.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
            },
            label: function (context: any) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.parsed.y !== null) {
                label += '₹' + context.parsed.y.toLocaleString('en-IN');
              }
              return label;
            },
          },
        },
      },
    }),
    [gridColor, textColor, monthName, data.labels],
  );

  // Shared line styling — applied regardless of daily vs cumulative mode
  const styledLineData = useMemo(
    () => ({
      ...data,
      datasets: data.datasets.map((ds) => {
        const baseColor =
          typeof ds.backgroundColor === 'string'
            ? ds.backgroundColor
            : '#1AAFA0';

        const daily = ds.data as number[];

        const values =
          lineMode === 'cumulative'
            ? daily.reduce<number[]>((acc, val, i) => {
                acc.push((acc[i - 1] ?? 0) + (val ?? 0));
                return acc;
              }, [])
            : daily;

        return {
          ...ds,
          data: values,
          label: lineMode === 'cumulative' ? 'Running total' : 'Daily spend',
          fill: true,
          backgroundColor: baseColor + '33',
          borderColor: baseColor,
          borderWidth: 2,
          pointBackgroundColor: baseColor,
          pointBorderColor: baseColor,
        };
      }),
    }),
    [data, lineMode],
  );

  return (
    <Box
      width={width}
      height={height}
      position={'relative'}
      borderRadius={10}
      p={3}
      shadow={'0px 0px 10px rgba(0, 0, 0, 0.25)'}
    >
      {/* Header row */}
      <HStack justifyContent="space-between" alignItems="center" mb={1} gap={2}>
        <Text fontSize={'sm'} fontWeight={'semibold'} flex={1} textAlign="center">
          {timeWindow} expense stats
        </Text>

        <HStack gap={1.5} flexShrink={0}>
          {/* Day wise / Running total toggle — only visible in line mode */}
          {chartType === 'line' && (
            <HStack
              gap={0.5}
              bg={isDark ? 'whiteAlpha.100' : 'blackAlpha.50'}
              borderRadius="md"
              p={0.5}
            >
              <IconButton
                aria-label="Day wise"
                title="Day wise"
                size="2xs"
                variant="ghost"
                borderRadius="sm"
                bg={lineMode === 'daily' ? activeToggleBg : 'transparent'}
                color={lineMode === 'daily' ? 'indigo.400' : inactiveColor}
                shadow={lineMode === 'daily' ? 'sm' : 'none'}
                onClick={() => setLineMode('daily')}
                _hover={{ bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.100' }}
                transition="all 0.15s"
              >
                <LuCalendarDays size={12} />
              </IconButton>

              <IconButton
                aria-label="Running total"
                title="Running total"
                size="2xs"
                variant="ghost"
                borderRadius="sm"
                bg={lineMode === 'cumulative' ? activeToggleBg : 'transparent'}
                color={lineMode === 'cumulative' ? 'indigo.400' : inactiveColor}
                shadow={lineMode === 'cumulative' ? 'sm' : 'none'}
                onClick={() => setLineMode('cumulative')}
                _hover={{ bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.100' }}
                transition="all 0.15s"
              >
                <LuTrendingUp size={12} />
              </IconButton>
            </HStack>
          )}

          {/* Bar / Line chart type toggle */}
          <HStack
            gap={0.5}
            bg={isDark ? 'whiteAlpha.100' : 'blackAlpha.50'}
            borderRadius="md"
            p={0.5}
          >
            <IconButton
              aria-label="Switch to bar chart"
              title="Bar chart"
              size="2xs"
              variant="ghost"
              borderRadius="sm"
              bg={chartType === 'bar' ? activeToggleBg : 'transparent'}
              color={chartType === 'bar' ? 'teal.400' : inactiveColor}
              shadow={chartType === 'bar' ? 'sm' : 'none'}
              onClick={() => setChartType('bar')}
              _hover={{ bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.100' }}
              transition="all 0.15s"
            >
              <LuChartColumn size={13} />
            </IconButton>

            <IconButton
              aria-label="Switch to line chart"
              title="Line chart"
              size="2xs"
              variant="ghost"
              borderRadius="sm"
              bg={chartType === 'line' ? activeToggleBg : 'transparent'}
              color={chartType === 'line' ? 'teal.400' : inactiveColor}
              shadow={chartType === 'line' ? 'sm' : 'none'}
              onClick={() => setChartType('line')}
              _hover={{ bg: isDark ? 'whiteAlpha.200' : 'blackAlpha.100' }}
              transition="all 0.15s"
            >
              <LuChartLine size={13} />
            </IconButton>
          </HStack>
        </HStack>
      </HStack>

      {/* Chart area */}
      <Box position="relative" height="calc(100% - 28px)">
        {chartType === 'bar' ? (
          <Bar data={data} redraw options={chartOptions as any} />
        ) : (
          <Line data={styledLineData as any} redraw options={chartOptions as any} />
        )}
      </Box>
    </Box>
  );
};

export default LineChart;
