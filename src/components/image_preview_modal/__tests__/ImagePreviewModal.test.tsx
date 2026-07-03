import { fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../testUtils/renderUtils';
import ImagePreviewModal from '../ImagePreviewModal';
import { appStore } from '../../../store';

jest.mock('@chakra-ui/react', () => {
  const original = jest.requireActual('@chakra-ui/react');
  return {
    ...original,
    Dialog: {
      Root: ({ children, onOpenChange, open }: any) => {
        if (!open) return null;
        return (
          <div
            data-testid="mock-dialog-root"
            data-open={open}
            onClick={() => onOpenChange?.({ open: false })}
          >
            {children}
          </div>
        );
      },
      Backdrop: () => <div data-testid="mock-backdrop" />,
      Positioner: ({ children }: any) => <div data-testid="mock-positioner">{children}</div>,
      Content: ({ children }: any) => <div data-testid="mock-content">{children}</div>,
      CloseTrigger: () => <button data-testid="mock-close-trigger" />,
      Body: ({ children }: any) => <div data-testid="mock-body">{children}</div>,
    },
  };
});

describe('ImagePreviewModal component', () => {
  beforeEach(() => {
    act(() => {
      appStore.getState().ImageModal.setImageString('initial-image');
    });
  });

  it('renders nothing when image is empty', () => {
    renderWithProviders(<ImagePreviewModal image="" />);
    expect(screen.queryByAltText('preview')).not.toBeInTheDocument();
  });

  it('renders image preview when image source is provided', () => {
    renderWithProviders(
      <ImagePreviewModal image="https://example.com/test.png" />,
    );
    const img = screen.getByAltText('preview');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/test.png');
  });

  it('clears the image string in store on open change false', () => {
    renderWithProviders(
      <ImagePreviewModal image="https://example.com/test.png" />,
    );
    const dialogRoot = screen.getByTestId('mock-dialog-root');
    expect(appStore.getState().ImageModal.imageString).toBe('initial-image');
    
    act(() => {
      fireEvent.click(dialogRoot);
    });
    
    expect(appStore.getState().ImageModal.imageString).toBe('');
  });
});
