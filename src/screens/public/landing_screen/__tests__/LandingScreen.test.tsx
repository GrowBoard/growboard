import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../testUtils/renderUtils';
import LandingScreen from '../LandingScreen';
import { appStore } from '@store';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@store', () => {
  const actual = jest.requireActual('@store');
  return {
    ...actual,
    appStore: jest.fn(),
  };
});

jest.mock('@assets', () => ({
  GrowboardIcon: () => <svg data-testid="growboard-icon" />,
}));

// Mock IntersectionObserver for scroll-reveal tests
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

beforeEach(() => {
  (window as any).IntersectionObserver = jest.fn(() => ({
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
  }));
});

describe('LandingScreen component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Re-assign after clearAllMocks
    (window as any).IntersectionObserver = jest.fn(() => ({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    }));
  });

  it('renders landing page sections and core elements correctly when guest', () => {
    (appStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ Auth: { token: '' } }),
    );

    renderWithProviders(<LandingScreen />);

    expect(screen.getByText('GrowBoard')).toBeInTheDocument();
    expect(
      screen.getByText('Your Data. Your Drive. Your Rules.'),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /Get Started/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('button', { name: /Explore/i }).length,
    ).toBeGreaterThan(0);
  });

  it('renders landing page with Console button when logged in', () => {
    (appStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ Auth: { token: 'valid-google-token' } }),
    );

    renderWithProviders(<LandingScreen />);

    expect(
      screen.getAllByRole('button', { name: /Go to Console/i }).length,
    ).toBeGreaterThan(0);
  });

  it('navigates to login on clicking Get Started if guest', () => {
    (appStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ Auth: { token: '' } }),
    );

    renderWithProviders(<LandingScreen />);

    const getStartedBtn = screen.getAllByRole('button', { name: /Get Started/i })[0];
    fireEvent.click(getStartedBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to dashboard on clicking Go to Console if authenticated', () => {
    (appStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ Auth: { token: 'valid-google-token' } }),
    );

    renderWithProviders(<LandingScreen />);

    const goConsoleBtn = screen.getAllByRole('button', {
      name: /Go to Console/i,
    })[0];
    fireEvent.click(goConsoleBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('updates console preview when clicking a module tab', () => {
    (appStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ Auth: { token: '' } }),
    );

    renderWithProviders(<LandingScreen />);

    // Default module is Credentials — check for a row value
    expect(screen.getByText('STRIPE_KEY')).toBeInTheDocument();

    // Click Expenses tab
    const expensesTab = screen.getByRole('button', { name: /Expenses/i });
    fireEvent.click(expensesTab);

    // Should switch to expenses content
    expect(screen.getByText('Rent & Utils')).toBeInTheDocument();
  });

  it('renders the Security & Privacy section with zero-data messaging', () => {
    (appStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ Auth: { token: '' } }),
    );

    renderWithProviders(<LandingScreen />);

    expect(
      screen.getByText("We Don't Want Your Data"),
    ).toBeInTheDocument();
    // "Zero Data Collection" appears in hero pill AND security card — both should be present
    expect(screen.getAllByText('Zero Data Collection').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('No Backend Servers')).toBeInTheDocument();
    // "Your Drive, Your Rules" appears in hero heading area — use getAllByText
    expect(screen.getAllByText(/Your Drive, Your Rules/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('No Third-Party Sharing')).toBeInTheDocument();
  });

  it('renders the Google Drive architecture section', () => {
    (appStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ Auth: { token: '' } }),
    );

    renderWithProviders(<LandingScreen />);

    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(
      screen.getByText('Authenticate with Google'),
    ).toBeInTheDocument();
    expect(screen.getByText('Data Stored as Sheets')).toBeInTheDocument();
    expect(screen.getByText('Offline-First Caching')).toBeInTheDocument();
    expect(screen.getByText('Full Portability')).toBeInTheDocument();
  });

  it('renders the features grid with all feature cards', () => {
    (appStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ Auth: { token: '' } }),
    );

    renderWithProviders(<LandingScreen />);

    expect(
      screen.getByText("Everything You Need, Nothing You Don't"),
    ).toBeInTheDocument();
    expect(screen.getByText('Offline-First Speed')).toBeInTheDocument();
    expect(screen.getByText('Google Drive Sync')).toBeInTheDocument();
    expect(screen.getByText('Privacy by Design')).toBeInTheDocument();
    expect(screen.getByText('Developer Ergonomics')).toBeInTheDocument();
  });

  it('renders final CTA section', () => {
    (appStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ Auth: { token: '' } }),
    );

    renderWithProviders(<LandingScreen />);

    expect(
      screen.getByText('Ready to Own Your Workspace?'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/It's Free/i),
    ).toBeInTheDocument();
  });

  it('sets up IntersectionObserver for scroll reveal', () => {
    (appStore as unknown as jest.Mock).mockImplementation((selector: any) =>
      selector({ Auth: { token: '' } }),
    );

    renderWithProviders(<LandingScreen />);

    // IntersectionObserver should have been instantiated
    expect(window.IntersectionObserver).toHaveBeenCalledTimes(1);
    // Multiple reveal elements should be observed
    expect(mockObserve).toHaveBeenCalled();
    expect(mockObserve.mock.calls.length).toBeGreaterThan(0);
  });
});
