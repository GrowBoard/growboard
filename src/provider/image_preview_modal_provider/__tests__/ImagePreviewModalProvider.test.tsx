import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import { renderWithProviders } from '../../../testUtils/renderUtils';
import ImagePreviewModalProvider from '../ImagePreviewModalProvider';
import { appStore } from '@store';

// Mock @provider to break circular dependency during test import phase
jest.mock('@provider', () => ({
  ThemeProvider: ({ children }: any) => (
    <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
  ),
}));

jest.mock('@components', () => ({
  ImagePreviewModal: ({ image }: { image: string }) => (
    <div data-testid="mock-image-modal" data-image={image}>
      Image Modal
    </div>
  ),
}));

describe('ImagePreviewModalProvider component', () => {
  it('renders children and loads image modal with state image string', () => {
    appStore.setState({
      ImageModal: {
        ...appStore.getState().ImageModal,
        imageString: 'http://test-image.png',
      },
    });

    renderWithProviders(
      <ImagePreviewModalProvider>
        <div data-testid="test-child">Child Element</div>
      </ImagePreviewModalProvider>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    const modal = screen.getByTestId('mock-image-modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute('data-image', 'http://test-image.png');
  });
});
