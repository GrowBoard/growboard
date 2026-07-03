import { appStore } from '../../../store';
import { act } from '@testing-library/react';

describe('ImageModal slice', () => {
  it('should have initial empty state values', () => {
    const state = appStore.getState().ImageModal;
    expect(state.imageString).toBe('');
  });

  it('should set image string successfully', () => {
    act(() => {
      appStore
        .getState()
        .ImageModal.setImageString('data:image/png;base64,...');
    });
    expect(appStore.getState().ImageModal.imageString).toBe(
      'data:image/png;base64,...',
    );
  });
});
