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
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Date',
                font: {
                  size: 14,
                },
              },
            },
            y: {
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, ticks) {
                  return '₹' + value;
                },
              },
              title: {
                display: true,
                text: 'Rupees (₹)',
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
              bodyFont: {
                size: 14,
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default LineChart;
