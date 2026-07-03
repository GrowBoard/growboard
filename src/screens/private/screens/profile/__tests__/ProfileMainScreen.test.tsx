import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../testUtils/renderUtils';
import ProfileMainScreen from '../ProfileMainScreen';

// Mock getSubNavTitle utility
jest.mock('../../../../../util/nav/NavTitle', () => ({
  __esModule: true,
  default: jest.fn(() => 'Mock Nav Title'),
}));

describe('ProfileMainScreen component', () => {
  it('renders navigation tabs and active subnav title', () => {
    renderWithProviders(<ProfileMainScreen />);

    // Check if subnav title is rendered
    expect(screen.getByText('Mock Nav Title')).toBeInTheDocument();

    // Check if PROFILE_ROUTES buttons are rendered by querying their hrefs
    expect(document.querySelector('a[href="/preview"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="/settings"]')).toBeInTheDocument();
  });
});
