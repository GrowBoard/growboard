import { useMemo } from 'react';
import { useColorMode } from '@components';
import { Bar } from 'react-chartjs-2';
import { LineChartProps } from './types';

import { Box, Text } from '@chakra-ui/react';
import { TimeWindow } from '@store';

const LineChart = ({
  data,
  width,
  height,
  timeWindow = TimeWindow.MONTH,
}: LineChartProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const gridColor = isDark
    ? 'rgba(255, 255, 255, 0.12)'
    : 'rgba(0, 0, 0, 0.08)';
  const textColor = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';

  const monthName = useMemo(() => {
    if (!data?.labels || data.labels.length === 0) return 'Date';
    const firstLabel = data.labels[0] as string;
    const d = new Date(firstLabel);
    if (isNaN(d.getTime())) return 'Date';
    return d.toLocaleString('default', { month: 'long' });
  }, [data]);

  return (
    <Box
      width={width}
      height={height}
      position={'relative'}
      borderRadius={10}
      p={3}
      shadow={'0px 0px 10px rgba(0, 0, 0, 0.25)'}
    >
      <Text fontSize={'sm'} fontWeight={'semibold'} textAlign={'center'}>
        {timeWindow} expense stats
      </Text>
      <Bar
        data={data}
        redraw
        options={{
          maintainAspectRatio: false,
          scales: {
            x: {
              display: true,
              grid: {
                color: gridColor,
              },
              ticks: {
                color: textColor,
                callback: function (val, index) {
                  const label = this.getLabelForValue(val as number);
                  const parts = label.split('-');
                  return parts.length === 3 ? parseInt(parts[2], 10) : label;
                },
              },
              title: {
                display: true,
                text: monthName,
                color: textColor,
                font: {
                  size: 14,
                },
              },
            },
            y: {
              grid: {
                color: gridColor,
              },
              ticks: {
                color: textColor,
                callback: function (value, index, ticks) {
                  return '₹' + value.toLocaleString('en-IN');
                },
              },
              title: {
                display: true,
                text: 'Rupees (₹)',
                color: textColor,
                font: {
                  size: 14,
                },
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
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
                title: function (context) {
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
                label: function (context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += '₹' + context.parsed.y.toLocaleString('en-IN');
                  }
                  return label;
                },
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default LineChart;
