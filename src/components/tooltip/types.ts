export type TooltipComponentProps = {
  title: string;
  children: React.ReactNode;
  position?: 'tooltip-top' | 'bottom' | 'left' | 'tooltip-right';
  disable?: boolean;
};
