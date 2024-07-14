import { IMAGE_MODAL_ID } from './constants';
import { ImagePreviewModalButtonProps } from './types';

/**
 * Image modal button component.
 *
 * @param props  The image modal button props.
 * @returns The image modal button component.
 */
const ImagePreviewModalButton = ({
  children,
  onClickHandler,
}: ImagePreviewModalButtonProps) => {
  return (
    <label htmlFor={IMAGE_MODAL_ID} onClick={onClickHandler}>
      {children}
    </label>
  );
};

export default ImagePreviewModalButton;
