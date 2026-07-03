import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import ProfileSettingScreen from '../ProfileSettingScreen';

// Mock components and hooks
jest.mock('@components', () => {
  const original = jest.requireActual('@components');
  return {
    ...original,
    PageLoadingComponent: () => <div data-testid="page-loading">Loading...</div>,
  };
});

jest.mock('../components', () => ({
  ProfileForm: () => <div>Mock Profile Form</div>,
}));

jest.mock('@services/hooks/private', () => ({
  useGetProfileData: jest.fn(() => ({
    isLoading: false,
    data: null,
  })),
  useSaveProfileData: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
}));

describe('ProfileSettingScreen component', () => {
  it('renders loading component when loading', () => {
    const { useGetProfileData } = require('@services/hooks/private');
    useGetProfileData.mockReturnValueOnce({ isLoading: true });

    renderWithProviders(<ProfileSettingScreen />);
    // Verify loading spinner/component is shown
    expect(screen.getByTestId('page-loading')).toBeInTheDocument();
  });

  it('renders form when data loading is finished', () => {
    const { useGetProfileData } = require('@services/hooks/private');
    useGetProfileData.mockReturnValueOnce({ isLoading: false });

    renderWithProviders(<ProfileSettingScreen />);
    expect(screen.getByText('Mock Profile Form')).toBeInTheDocument();
  });
});
