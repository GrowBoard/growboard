import { AppStoreSlice } from '@store';
import { ImageModalState, ImageModalStateSlice } from './types';

/**
 * The initial state configuration for the image modal slice.
 */
const initialState: ImageModalState = {
  imageString: '',
};

/**
 * createImageModalSlice.
 * Initializes the state slice and action for managing an image modal's content.
 *
 * @param set Central store setter callback.
 * @returns The image modal state and actions slice.
 */
const createImageModalSlice: AppStoreSlice<ImageModalStateSlice> = (set) => ({
  ...initialState,
  /**
   * Sets the image string (e.g., base64 data or URL) to be displayed in the modal.
   */
  setImageString: (imageString: string) =>
    set((state) => {
      state.ImageModal.imageString = imageString;
    }),
});

export default createImageModalSlice;
