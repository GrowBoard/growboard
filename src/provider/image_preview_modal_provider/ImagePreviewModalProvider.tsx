import { ImagePreviewModal } from '@dash-ui';
import { ImagePreviewModalProviderProps } from './types';
import { appStore } from '@store';
import { imageModalSelector, useShallow } from '@selectors';

const ImagePreviewModalProvider = (props: ImagePreviewModalProviderProps) => {
  const { imageString: modalImage } = appStore(useShallow(imageModalSelector));
  return (
    <div>
      <ImagePreviewModal image={modalImage} />
      {props.children}
    </div>
  );
};

export default ImagePreviewModalProvider;
