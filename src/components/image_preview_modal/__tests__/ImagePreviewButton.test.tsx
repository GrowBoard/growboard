import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../testUtils/renderUtils';
import ImagePreviewModalButton from '../ImagePreviewButton';

describe('ImagePreviewModalButton component', () => {
  it('renders children and handles click event', () => {
    const onClick = jest.fn();
    renderWithProviders(
      <ImagePreviewModalButton onClickHandler={onClick}>
        <span>Click Me</span>
      </ImagePreviewModalButton>,
    );

    const button = screen.getByRole('button', { name: /Click Me/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
