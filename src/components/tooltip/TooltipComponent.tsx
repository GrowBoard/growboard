import { TooltipComponentProps } from './types';

const TooltipComponent = ({
  disable,
  title,
  children,
  position,
}: TooltipComponentProps) => {
  const show = disable !== null && disable === true ? false : true;
  const positionData = position || 'tooltip-top';
  return (
    <div
      className={`${show ? ' tooltip' : ''} ${positionData}`}
      data-tip={title}
    >
      {children}
    </div>
  );
};

export default TooltipComponent;
