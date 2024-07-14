import { AppStoreSlice } from '@store';
import { ImageModalState, ImageModalStateSlice } from './types';

const initialState: ImageModalState = {
  imageString: '',
};

const createImageModalSlice: AppStoreSlice<ImageModalStateSlice> = (set) => ({
  ...initialState,
  setImageString: (imageString: string) =>
    set((state) => {
      state.ImageModal.imageString = imageString;
    }),
});

export default createImageModalSlice;
