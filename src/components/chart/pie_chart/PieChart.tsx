import { Pie } from 'react-chartjs-2';
import { PieChartProps } from './types';

import { Box, Text } from '@chakra-ui/react';

const PieChart = ({ data, width, height }: PieChartProps) => {
  return (
    <Box
      width={width}
      height={height}
      borderRadius={10}
      p={3}
      shadow={'0px 0px 10px rgba(0, 0, 0, 0.25)'}
    >
      <Text fontSize={'sm'} fontWeight={'semibold'} textAlign={'center'}>
        Expense Distribution
      </Text>
      <Pie
        data={data}
        redraw
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
        }}
        options={{
          plugins: {
            legend: {
              display: true,
              position: 'right',
              labels: {
                font: {
                  size: 14,
                },
              },
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

export default PieChart;
