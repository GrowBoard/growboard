import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../testUtils/renderUtils';
import PlansScreen from '../PlansScreen';
import {
  useGetPlansData,
  useSavePlanData,
  useDeletePlanData,
} from '@services/hooks/private';
import { PlanItem } from '@store';

// Mock the React Query hooks
jest.mock('@services/hooks/private', () => ({
  useGetPlansData: jest.fn(),
  useSavePlanData: jest.fn(),
  useDeletePlanData: jest.fn(),
}));

// Mock Zustand App Store
const mockUpdatePlans = jest.fn();
const mockRemovePlans = jest.fn();

const mockPlanItem: PlanItem = {
  Id: 'plan-1',
  title: 'React Dev Plan',
  subtitle: 'Master React v18',
  date: '2026-06-30',
  time: '14:30',
  tags: ['React', 'Frontend'],
  about_plan: 'Review all core hooks and components.',
};

jest.mock('@store', () => {
  const mockState = {
    Plans: {
      plansData: [
        {
          Id: 'plan-1',
          title: 'React Dev Plan',
          subtitle: 'Master React v18',
          date: '2026-06-30',
          time: '14:30',
          tags: ['React', 'Frontend'],
          about_plan: 'Review all core hooks and components.',
        },
      ],
      updatePlans: mockUpdatePlans,
      removePlans: mockRemovePlans,
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

  return {
    appStore: mockStore,
  };
});

describe('PlansScreen component', () => {
  let mockMutateSave: jest.Mock;
  let mockMutateDelete: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    const { appStore } = require('@store');
    (appStore as jest.Mock).mockImplementation((selector: any) => {
      return selector({
        Plans: {
          plansData: [mockPlanItem],
          updatePlans: mockUpdatePlans,
          removePlans: mockRemovePlans,
        },
      });
    });

    (useGetPlansData as jest.Mock).mockReturnValue({
      isLoading: false,
      data: {
        data: [mockPlanItem],
        status: 'SUCCESS',
        successMessage: 'Success',
      },
    });

    mockMutateSave = jest.fn().mockResolvedValue(undefined);
    (useSavePlanData as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateSave,
      isPending: false,
    });

    mockMutateDelete = jest.fn().mockResolvedValue(undefined);
    (useDeletePlanData as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateDelete,
      isPending: false,
    });
  });

  it('renders title and plans list cards', () => {
    renderWithProviders(<PlansScreen />);

    expect(screen.getByText('Plans')).toBeInTheDocument();
    expect(screen.getByText('React Dev Plan')).toBeInTheDocument();
    expect(screen.getByText('Master React v18')).toBeInTheDocument();
    expect(screen.getByText('2026-06-30')).toBeInTheDocument();
  });

  it('opens add plan drawer on clicking add button', () => {
    renderWithProviders(<PlansScreen />);

    const addBtn = screen.getByRole('button', { name: 'Add Plan' });
    fireEvent.click(addBtn);

    expect(screen.getByText('Add Plan')).toBeInTheDocument();
  });

  it('shows no matching results empty state when search query does not match', () => {
    renderWithProviders(<PlansScreen />);

    const searchInput = screen.getByPlaceholderText(
      /Search plans by title, tags, about.../i,
    );
    fireEvent.change(searchInput, { target: { value: 'non-existent' } });

    expect(screen.getByText('No matching plans')).toBeInTheDocument();
  });

  it('shows no plans empty state when user has no plans', () => {
    const { appStore } = require('@store');
    (appStore as jest.Mock).mockImplementation((selector: any) => {
      return selector({
        Plans: {
          plansData: [],
          updatePlans: mockUpdatePlans,
          removePlans: mockRemovePlans,
        },
      });
    });

    renderWithProviders(<PlansScreen />);
    expect(screen.getByText(/No plans found/i)).toBeInTheDocument();
  });
});
