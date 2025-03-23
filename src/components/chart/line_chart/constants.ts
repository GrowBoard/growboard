import { LineChartProps } from './types';

export const LINE_DAY_CHART_DATA: LineChartProps['data'] = {
  datasets: [
    {
      data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000)),
      backgroundColor: '#1AAFA0',
    },
  ],
  labels: Array.from({ length: 30 }, (_, i) => i + 1),
};

export const LINE_MONTH_CHART_DATA: LineChartProps['data'] = {
  datasets: [
    {
      data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 1000)),
      backgroundColor: '#1AAFA0',
    },
  ],
  labels: Array.from({ length: 12 }, (_, i) =>
    new Date(2025, i).toLocaleString('default', { month: 'short' }),
  ),
};
