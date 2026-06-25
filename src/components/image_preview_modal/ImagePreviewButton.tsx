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
    <button
      type="button"
      onClick={onClickHandler}
      style={{
        border: 'none',
        background: 'none',
        padding: 0,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
};

export default ImagePreviewModalButton;
