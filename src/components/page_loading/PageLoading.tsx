import { PageLoadingComponentProps } from './types';

/**
 * Page loading component.
 *
 * @param props  The page loading component props.
 * @returns The page loading component.
 */
const PageLoadingComponent = (props: PageLoadingComponentProps) => {
  return (
    <div className=" h-full w-full justify-center items-center flex ">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
};

export default PageLoadingComponent;
