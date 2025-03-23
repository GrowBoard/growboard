import { BoxProps } from '@chakra-ui/react';
import { TimeWindow } from '@store';
import { ChartData } from 'chart.js';

export type LineChartProps = {
  timeWindow?: TimeWindow;
  data: ChartData<'bar', number[], unknown>;
} & Pick<BoxProps, 'width' | 'height'>;
