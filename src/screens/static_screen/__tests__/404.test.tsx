import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../testUtils/renderUtils';
import Error404 from '../404';

describe('Error404 screen', () => {
  it('renders the 404 error page translation correctly', () => {
    renderWithProviders(<Error404 />);
    // "Static.errorText" translations evaluates to "Error404" as seen in main.json
    expect(screen.getByText('Error404')).toBeInTheDocument();
  });
});
