import { BoxProps } from '@chakra-ui/react';
import { ChartData } from 'chart.js';

export type PieChartProps = {
  data: ChartData<'pie', number[], unknown>;
  totalTransactions?: number;
  highestCategory?: { name: string; amount: number; color: string } | null;
  dailyAverage?: number;
} & Pick<BoxProps, 'width' | 'height'>;
