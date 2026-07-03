import { screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import { renderWithProviders } from '../../../../testUtils/renderUtils';

// Import lazy components
import {
  LazyExpenseScreenComponent,
  LazyExpensePreviewScreenComponent,
} from '../LazyExpensesScreen';
import {
  LazyLoginScreenComponent,
  LazyLandingScreenComponent,
} from '../LazyPublicScreen';
import {
  LazyError404ScreenComponent,
  LazyPrivacyPolicyScreenComponent,
  LazyDataPolicyScreenComponent,
  LazyTermsScreenComponent,
} from '../LazyStaticScreen';
import {
  LazyHomeScreenComponent,
  LazyDashboardScreenComponent,
} from '../LazyPrivateScreen';
import {
  LazyProfileMainScreenComponent,
  LazyProfileSettingScreenComponent,
  LazyProfilePreviewScreenComponent,
} from '../LazyProfileScreen';
import { LazyCredsScreenComponent } from '../LazyCredsScreen';
import { LazyGoalsScreenComponent } from '../LazyGoalsScreen';
import { LazyLearningsScreenComponent } from '../LazyLearningsScreen';
import { LazyPlansScreenComponent } from '../LazyPlansScreen';
import { LazyProjectsScreenComponent } from '../LazyProjectScreen';
import { LazyResourcesScreenComponent } from '../LazyResourcesScreen';

// Mock @provider to break circular dependency during test import phase
jest.mock('@provider', () => ({
  ThemeProvider: ({ children }: any) => (
    <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
  ),
}));

// Mock target screen components to render synchronously
jest.mock('@screens/private/screens/expenses/ExpenseScreen', () => function MockExpenseScreen() { return <div data-testid="mock-expense-screen" />; });
jest.mock('@screens/private/screens/expenses/expense_preview', () => ({
  ExpensePreviewScreen: function MockExpensePreviewScreen() { return <div data-testid="mock-expense-preview-screen" />; },
}));
jest.mock('@screens/public/login_screen/LoginScreen', () => function MockLoginScreen() { return <div data-testid="mock-login-screen" />; });
jest.mock('@screens/public/landing_screen/LandingScreen', () => function MockLandingScreen() { return <div data-testid="mock-landing-screen" />; });
jest.mock('@screens/static_screen/404', () => function Mock404Screen() { return <div data-testid="mock-404-screen" />; });
jest.mock('@screens/static_screen/PrivacyPolicy', () => function MockPrivacyScreen() { return <div data-testid="mock-privacy-screen" />; });
jest.mock('@screens/static_screen/DataPolicy', () => function MockDataScreen() { return <div data-testid="mock-data-screen" />; });
jest.mock('@screens/static_screen/TermsAndConditions', () => function MockTermsScreen() { return <div data-testid="mock-terms-screen" />; });
jest.mock('@screens/private/MainRootScreen/MainRootScreen', () => function MockHomeScreen() { return <div data-testid="mock-home-screen" />; });
jest.mock('@screens/private/screens/dashboard_home/DashboardHome', () => function MockDashboardScreen() { return <div data-testid="mock-dashboard-screen" />; });
jest.mock('@screens/private/screens/profile/ProfileMainScreen', () => function MockProfileMainScreen() { return <div data-testid="mock-profile-main-screen" />; });
jest.mock('@screens/private/screens/profile/profile_setting/ProfileSettingScreen', () => function MockProfileSettingScreen() { return <div data-testid="mock-profile-setting-screen" />; });
jest.mock('@screens/private/screens/profile/profile_preview/ProfilePreviewScreen', () => function MockProfilePreviewScreen() { return <div data-testid="mock-profile-preview-screen" />; });
jest.mock('@screens/private/screens/creds/CredsScreen', () => function MockCredsScreen() { return <div data-testid="mock-creds-screen" />; });
jest.mock('@screens/private/screens/goals/GoalsScreen', () => function MockGoalsScreen() { return <div data-testid="mock-goals-screen" />; });
jest.mock('@screens/private/screens/learnings/LearningsScreen', () => function MockLearningsScreen() { return <div data-testid="mock-learnings-screen" />; });
jest.mock('@screens/private/screens/plans/PlansScreen', () => function MockPlansScreen() { return <div data-testid="mock-plans-screen" />; });
jest.mock('@screens/private/screens/projects/ProjectScreen', () => function MockProjectScreen() { return <div data-testid="mock-project-screen" />; });
jest.mock('@screens/private/screens/resources/ResourcesScreen', () => function MockResourcesScreen() { return <div data-testid="mock-resources-screen" />; });

describe('Lazy Screen Components', () => {
  it('renders LazyExpenseScreenComponent successfully', async () => {
    renderWithProviders(<LazyExpenseScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-expense-screen')).toBeInTheDocument();
    });
  });

  it('renders LazyExpensePreviewScreenComponent successfully', async () => {
    renderWithProviders(<LazyExpensePreviewScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-expense-preview-screen')).toBeInTheDocument();
    });
  });

  it('renders LazyLoginScreenComponent successfully', async () => {
    renderWithProviders(<LazyLoginScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-login-screen')).toBeInTheDocument();
    });
  });

  it('renders LazyLandingScreenComponent successfully', async () => {
    renderWithProviders(<LazyLandingScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-landing-screen')).toBeInTheDocument();
    });
  });

  it('renders LazyError404ScreenComponent successfully', async () => {
    renderWithProviders(<LazyError404ScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-404-screen')).toBeInTheDocument();
    });
  });

  it('renders LazyPrivacyPolicyScreenComponent successfully', async () => {
    renderWithProviders(<LazyPrivacyPolicyScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-privacy-screen')).toBeInTheDocument();
    });
  });

  it('renders LazyDataPolicyScreenComponent successfully', async () => {
    renderWithProviders(<LazyDataPolicyScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-data-screen')).toBeInTheDocument();
    });
  });

  it('renders LazyTermsScreenComponent successfully', async () => {
    renderWithProviders(<LazyTermsScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-terms-screen')).toBeInTheDocument();
    });
  });

  it('renders LazyHomeScreenComponent successfully', async () => {
    renderWithProviders(<LazyHomeScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-home-screen')).toBeInTheDocument();
    });
  });

  it('renders LazyDashboardScreenComponent successfully', async () => {
    renderWithProviders(<LazyDashboardScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-dashboard-screen')).toBeInTheDocument();
    });
  });

  it('renders LazyProfileMainScreenComponent successfully', async () => {
    renderWithProviders(<LazyProfileMainScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-profile-main-screen')).toBeInTheDocument();
    });
  });

  it('renders LazyProfileSettingScreenComponent successfully', async () => {
    renderWithProviders(<LazyProfileSettingScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-profile-setting-screen')).toBeInTheDocument();
    });
  });

  it('renders LazyProfilePreviewScreenComponent successfully', async () => {
    renderWithProviders(<LazyProfilePreviewScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-profile-preview-screen')).toBeInTheDocument();
    });
  });

  it('renders LazyCredsScreenComponent successfully', async () => {
    renderWithProviders(<LazyCredsScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-creds-screen')).toBeInTheDocument();
    });
  });

  it('renders LazyGoalsScreenComponent successfully', async () => {
    renderWithProviders(<LazyGoalsScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-goals-screen')).toBeInTheDocument();
    });
  });

  it('renders LazyLearningsScreenComponent successfully', async () => {
    renderWithProviders(<LazyLearningsScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-learnings-screen')).toBeInTheDocument();
    });
  });

  it('renders LazyPlansScreenComponent successfully', async () => {
    renderWithProviders(<LazyPlansScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-plans-screen')).toBeInTheDocument();
    });
  });

  it('renders LazyProjectsScreenComponent successfully', async () => {
    renderWithProviders(<LazyProjectsScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-project-screen')).toBeInTheDocument();
    });
  });

  it('renders LazyResourcesScreenComponent successfully', async () => {
    renderWithProviders(<LazyResourcesScreenComponent />);
    await waitFor(() => {
      expect(screen.getByTestId('mock-resources-screen')).toBeInTheDocument();
    });
  });
});
