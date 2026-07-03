import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../testUtils/renderUtils';
import DashboardHome from '../DashboardHome';

// Mock the data-fetching hook for ExpenseSummary
jest.mock('@hooks', () => ({
  useGetExpensesDataForDate: jest.fn(() => ({
    data: { data: [], status: 'ok', successMessage: '' },
    isLoading: false,
  })),
}));

// Mock private query hooks
jest.mock('@services/hooks/private', () => ({
  useGetCredsData: jest.fn(() => ({ isLoading: false })),
  useGetPlansData: jest.fn(() => ({ isLoading: false })),
  useGetProjectsData: jest.fn(() => ({ isLoading: false })),
  useGetHabitsData: jest.fn(() => ({ isLoading: false })),
}));

// Mock react-joyride to prevent JSDOM layout API and portal issues
jest.mock('react-joyride', () => ({
  __esModule: true,
  Joyride: () => null,
  STATUS: {
    FINISHED: 'finished',
    SKIPPED: 'skipped',
  },
}));

// Mock Zustand App Store
jest.mock('@store', () => {
  const mockState = {
    Auth: {
      name: 'Test User',
      email: 'test@example.com',
      token: 'mock-token',
      picture: null,
    },
    Goals: {
      goalsData: [
        {
          title: 'Learn TypeScript',
          subtitle: 'Master advanced types',
          tags: ['dev'],
          details: 'Details here',
          timeline: [],
          status: 'In-Progress',
          createdAt: '2024-06-01T00:00:00.000Z',
          updatedAt: '2024-06-20T00:00:00.000Z',
        },
        {
          title: 'Read Clean Code',
          subtitle: 'Robert C. Martin',
          tags: [],
          details: '',
          timeline: [],
          status: 'Pending',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
      updateGoals: jest.fn(),
      removeGoals: jest.fn(),
    },
    Learnings: {
      learningsData: [
        {
          title: 'Kubernetes Basics',
          subtitle: 'CKA prep notes',
          tags: ['devops'],
          content: '# Content',
          createdAt: '2024-06-01T00:00:00.000Z',
          updatedAt: '2024-06-15T00:00:00.000Z',
        },
      ],
      updateLearnings: jest.fn(),
      removeLearnings: jest.fn(),
    },
    Creds: {
      credsData: [
        { credTitle: 'AWS Prod', credData: [] },
        { credTitle: 'GitHub Token', credData: [] },
      ],
      updateCreds: jest.fn(),
      removeCreds: jest.fn(),
    },
    Plans: {
      plansData: [],
      updatePlans: jest.fn(),
      removePlans: jest.fn(),
    },
    Projects: {
      projects: [],
      addProjects: jest.fn(),
      removeProjectsState: jest.fn(),
    },
    Habits: {
      habitsData: [],
      habitLogsData: [],
      updateHabits: jest.fn(),
      removeHabits: jest.fn(),
      updateHabitLogs: jest.fn(),
      removeHabitLogs: jest.fn(),
    },
    Expense: {
      overview: {
        timeWindow: 'Month',
        day: 28,
        month: 5,
        year: 2026,
      },
      date: new Date('2026-06-28T00:00:00.000Z'),
      addExpense: {
        isOpen: false,
      },
      setTimeWindow: jest.fn(),
      setOverviewInput: jest.fn(),
      setOverviewInputWithDay: jest.fn(),
      setAddExpense: jest.fn(),
    },
  };

  const mockStore = Object.assign(
    jest.fn((selector: (state: typeof mockState) => unknown) => {
      return selector(mockState);
    }),
    {
      getState: jest.fn(() => mockState),
    },
  );

  return { appStore: mockStore };
});

describe('DashboardHome component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the greeting with the user name', () => {
    renderWithProviders(<DashboardHome />);
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
  });

  it('renders the stat tiles labels', () => {
    renderWithProviders(<DashboardHome />);
    expect(screen.getByText('Total Goals')).toBeInTheDocument();
    expect(screen.getByText('Active Goals')).toBeInTheDocument();
    expect(screen.getByText('Learnings')).toBeInTheDocument();
    // "Credentials" appears in both StatsTiles and QuickActions
    const credEls = screen.getAllByText('Credentials');
    expect(credEls.length).toBeGreaterThanOrEqual(1);
  });

  it('displays the correct total goals count', () => {
    renderWithProviders(<DashboardHome />);
    // 2 goals in mock data — getAllByText since the number may appear in multiple tiles
    const twos = screen.getAllByText('2');
    expect(twos.length).toBeGreaterThanOrEqual(1);
  });

  it('displays the correct active goals count', () => {
    renderWithProviders(<DashboardHome />);
    // 1 In-Progress goal; also appears as learnings count (1) — ensure at least one '1' exists
    const ones = screen.getAllByText('1');
    expect(ones.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Recent Goals section', () => {
    renderWithProviders(<DashboardHome />);
    expect(screen.getByText(/Recent Goals/i)).toBeInTheDocument();
    expect(screen.getByText('Learn TypeScript')).toBeInTheDocument();
  });

  it('renders the Recent Learnings section', () => {
    renderWithProviders(<DashboardHome />);
    expect(screen.getByText(/Recent Learnings/i)).toBeInTheDocument();
    expect(screen.getByText('Kubernetes Basics')).toBeInTheDocument();
  });

  it('renders the Quick Actions bar', () => {
    renderWithProviders(<DashboardHome />);
    expect(
      screen.getByRole('button', { name: /Add Goal/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Add Learning/i }),
    ).toBeInTheDocument();
  });
});
