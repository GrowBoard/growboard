import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { PieChartProps } from './types';

import { Box, Text, VStack, HStack } from '@chakra-ui/react';

const PieChart = ({
  data,
  width,
  height,
  totalTransactions = 0,
  highestCategory = null,
  dailyAverage = 0,
}: PieChartProps) => {
  // Calculate the total sum of the dataset to display in the center
  const totalSum = useMemo(() => {
    if (!data?.datasets?.[0]?.data) return 0;
    return data.datasets[0].data.reduce(
      (acc: number, val: any) => acc + (Number(val) || 0),
      0,
    );
  }, [data]);

  // Extract category names, values, and colors to build a custom premium legend
  const categoriesData = useMemo(() => {
    if (!data?.labels || !data?.datasets?.[0]) return [];
    return data.labels
      .map((label: any, index: number) => {
        const value = data.datasets[0].data[index] as number;
        const colorArray = data.datasets[0].backgroundColor;
        const color = Array.isArray(colorArray)
          ? (colorArray[index] as string)
          : (colorArray as string) || '#A0AEC0';
        const percentage =
          totalSum > 0 ? ((value / totalSum) * 100).toFixed(0) : '0';
        return { label: String(label), value, color, percentage };
      })
      .filter((item: any) => item.value > 0); // Only show categories with spendings
  }, [data, totalSum]);

  return (
    <Box
      width={width}
      height={height}
      borderRadius={10}
      p={4}
      shadow={'0px 0px 10px rgba(0, 0, 0, 0.25)'}
      bg="rgba(255, 255, 255, 0.01)"
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.04)"
    >
      <Text fontSize={'sm'} fontWeight={'semibold'} textAlign={'center'} mb={4}>
        Expense Distribution
      </Text>
      <HStack
        gap={6}
        height="calc(100% - 30px)"
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems="center"
        justifyContent="center"
      >
        {/* Doughnut Chart with Absolute Centered Total */}
        <Box position="relative" w="170px" h="170px" flexShrink={0}>
          <Doughnut
            data={data as any}
            redraw
            options={{
              maintainAspectRatio: false,
              cutout: '75%',
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
                  boxPadding: 6,
                  callbacks: {
                    label: function (context) {
                      const label = context.label || '';
                      const value = context.parsed;
                      return ` ${label}: ₹${value.toLocaleString('en-IN')}`;
                    },
                  },
                },
              },
            }}
          />
          <VStack
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            justifyContent="center"
            alignItems="center"
            pointerEvents="none"
            gap={0.5}
          >
            <Text
              fontSize="9px"
              fontWeight="bold"
              color="text.secondary"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Total Spend
            </Text>
            <Text fontSize="md" fontWeight="extrabold" color="text.primary">
              ₹{totalSum.toLocaleString('en-IN')}
            </Text>
          </VStack>
        </Box>

        {/* Custom Legend & Insights */}
        <VStack align="stretch" gap={3} flex={1} height="100%">
          {/* Scrollable Legend */}
          {categoriesData.length > 0 ? (
            <VStack
              align="stretch"
              gap={2}
              overflowY="auto"
              maxH="120px"
              w="100%"
              pr={1}
              css={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '4px',
                },
              }}
            >
              {categoriesData.map((item) => (
                <HStack
                  key={item.label}
                  justifyContent="space-between"
                  fontSize="2xs"
                  py={0.5}
                  borderBottom="1px solid"
                  borderColor="border.subtle"
                >
                  <HStack gap={1.5}>
                    <Box w={1.5} h={1.5} borderRadius="full" bg={item.color} />
                    <Text fontWeight="semibold" color="text.secondary">
                      {item.label}
                    </Text>
                    <Text color="text.muted" fontSize="9px">
                      ({item.percentage}%)
                    </Text>
                  </HStack>
                  <Text fontWeight="bold" color="text.primary">
                    ₹{item.value.toLocaleString('en-IN')}
                  </Text>
                </HStack>
              ))}
            </VStack>
          ) : (
            <VStack
              justifyContent="center"
              alignItems="center"
              height="120px"
              w="100%"
            >
              <Text fontSize="xs" color="text.muted">
                No expenses recorded
              </Text>
            </VStack>
          )}

          {/* Quick Insights Section */}
          <Box
            borderTop="1px dashed"
            borderColor="border.subtle"
            pt={2.5}
            mt="auto"
          >
            <Text
              fontSize="10px"
              fontWeight="bold"
              color="indigo.400"
              textTransform="uppercase"
              mb={2}
              letterSpacing="wider"
            >
              Quick Insights
            </Text>
            <HStack justifyContent="space-between" fontSize="2xs" mb={1}>
              <Text color="text.secondary">Daily Average:</Text>
              <Text fontWeight="bold" color="text.primary">
                ₹{Math.round(dailyAverage).toLocaleString('en-IN')}
              </Text>
            </HStack>
            {highestCategory && (
              <HStack justifyContent="space-between" fontSize="2xs" mb={1}>
                <Text color="text.secondary">Peak Category:</Text>
                <HStack gap={1}>
                  <Box
                    w={1.5}
                    h={1.5}
                    borderRadius="full"
                    bg={highestCategory.color}
                  />
                  <Text fontWeight="bold" color="text.primary">
                    {highestCategory.name} (₹
                    {highestCategory.amount.toLocaleString('en-IN')})
                  </Text>
                </HStack>
              </HStack>
            )}
            <HStack justifyContent="space-between" fontSize="2xs">
              <Text color="text.secondary">Total Entries:</Text>
              <Text fontWeight="bold" color="text.primary">
                {totalTransactions} transactions
              </Text>
            </HStack>
          </Box>
        </VStack>
      </HStack>
    </Box>
  );
};

export default PieChart;
