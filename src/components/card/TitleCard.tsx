import { TitleCardProps } from './types';

/**
 * Title card component.
 *
 * @param props The title card props.
 * @returns The title card component.
 */
const TitleCard = (props: TitleCardProps) => {
  return (
    <div
      className={
        'card w-full p-6 bg-base-100 shadow-xl ' + (props.topMargin || 'mt-6')
      }
    >
      {/* Title for Card */}
      <div
        className={`text-xl font-semibold ${
          props.TopSideButtons ? 'inline-block' : ''
        }`}
      >
        {props.title}
        {/* Top side button, show only if present */}
        {props.TopSideButtons && (
          <div className="inline-block float-right">{props.TopSideButtons}</div>
        )}
      </div>

      <div className="divider mt-2"></div>

      {/** Card Body */}
      <div className="h-full w-full pb-6 bg-base-100">{props.children}</div>
    </div>
  );
};

export default TitleCard;
