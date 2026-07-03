import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../testUtils/renderUtils';
import MainRootScreen from '../MainRootScreen';
import { appStore } from '@store';
import { googleLogout } from '@react-oauth/google';

// Mock googleLogout
jest.mock('@react-oauth/google', () => ({
  googleLogout: jest.fn(),
}));

// Mock NavigationComponent and SidebarComponent
jest.mock('@components', () => {
  const original = jest.requireActual('@components');
  return {
    ...original,
    NavigationComponent: ({ logOutClickHandler }: any) => (
      <div>
        <span>GrowBoard</span>
        <button onClick={logOutClickHandler}>Mock Logout</button>
      </div>
    ),
    SidebarComponent: () => <div>Mock Sidebar</div>,
  };
});

// Mock react-query and private finance hooks
jest.mock('@services/hooks/private', () => ({
  useAddExpenseData: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  useEditExpenseData: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
}));

jest.mock('@hooks', () => ({
  useGetExpensesDataForDate: jest.fn(() => ({
    isLoading: false,
    data: null,
  })),
}));

describe('MainRootScreen component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders navbar, sidebar, and layout components', () => {
    appStore.setState({
      Auth: {
        ...appStore.getState().Auth,
        token: 'valid-token',
        name: 'Alice',
        email: 'alice@example.com',
        picture: '',
      },
    });

    renderWithProviders(<MainRootScreen />);

    // Check if the logo/nav is present
    expect(screen.getByText(/GrowBoard/i)).toBeInTheDocument();
    expect(screen.getByText('Mock Sidebar')).toBeInTheDocument();
  });

  it('handles logout flow correctly', () => {
    appStore.setState({
      Auth: {
        ...appStore.getState().Auth,
        token: 'valid-token',
        name: 'Alice',
        email: 'alice@example.com',
        picture: '',
      },
    });

    renderWithProviders(<MainRootScreen />);

    // Trigger logout by clicking our mock logout button
    const logoutBtn = screen.getByRole('button', { name: /Mock Logout/i });
    fireEvent.click(logoutBtn);

    expect(googleLogout).toHaveBeenCalledTimes(1);
    expect(appStore.getState().Auth.token).toBe('');
  });
});
