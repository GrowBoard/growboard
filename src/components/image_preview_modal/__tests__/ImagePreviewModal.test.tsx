import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../testUtils/renderUtils';
import ImagePreviewModal from '../ImagePreviewModal';

describe('ImagePreviewModal component', () => {
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
});
