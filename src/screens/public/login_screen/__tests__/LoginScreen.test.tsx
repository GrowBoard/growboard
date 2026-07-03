import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../testUtils/renderUtils';
import LoginScreen from '../LoginScreen';

// Mock react-oauth/google
const mockLogin = jest.fn();
jest.mock('@react-oauth/google', () => ({
  useGoogleLogin: jest.fn(() => mockLogin),
}));

describe('LoginScreen component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title, subtitle, and login CTA button', () => {
    renderWithProviders(<LoginScreen />);
    expect(screen.getAllByText('Login')[0]).toBeInTheDocument();
    expect(screen.getByText('Sign in to continue')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Continue with Google/i }),
    ).toBeInTheDocument();
  });

  it('triggers Google Login on button click', () => {
    renderWithProviders(<LoginScreen />);
    const loginBtn = screen.getByRole('button', {
      name: /Continue with Google/i,
    });
    fireEvent.click(loginBtn);
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });
});
