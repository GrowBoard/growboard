import { AppStoreState } from '@store';

export const imageModalSelector = (state: AppStoreState) => ({
  imageString: state.ImageModal.imageString,
  setImageString: state.ImageModal.setImageString,
});
