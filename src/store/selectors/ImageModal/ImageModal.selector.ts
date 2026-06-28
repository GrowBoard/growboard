import { AppStoreState } from '@store';

/**
 * imageModalSelector.
 * Selects the image viewer modal state properties and handlers.
 * 
 * @param state The AppStoreState.
 * @returns Object holding the imageString and setter trigger callback.
 */
export const imageModalSelector = (state: AppStoreState) => ({
  /**
   * The URL/base64 representation of the image currently being focused in preview.
   */
  imageString: state.ImageModal.imageString,
  /**
   * Setter function to assign the active preview image.
   */
  setImageString: state.ImageModal.setImageString,
});
export default imageModalSelector;
