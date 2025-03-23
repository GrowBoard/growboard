import { BoxProps } from '@chakra-ui/react';
import { ChartData } from 'chart.js';

export type PieChartProps = {
  data: ChartData<'pie', number[], unknown>;
} & Pick<BoxProps, 'width' | 'height'>;
