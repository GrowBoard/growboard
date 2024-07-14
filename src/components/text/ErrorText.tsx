import { ErrorTextProps } from './types';

/**
 * ErrorText component.
 *
 * @param styleClass  The style class.
 * @param children  The children of the component.
 * @returns The ErrorText component.
 */
const ErrorText = ({ styleClass, children }: ErrorTextProps) => {
  return <p className={`text-center  text-error ${styleClass}`}>{children}</p>;
};

export default ErrorText;
