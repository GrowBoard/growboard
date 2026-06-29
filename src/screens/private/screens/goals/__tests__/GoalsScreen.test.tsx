import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../testUtils/renderUtils';
import GoalsScreen from '../GoalsScreen';
import { useGetGoalsData, useSaveGoalData, useDeleteGoalData } from '@services/hooks/private';

// Mock the React Query hooks
jest.mock('@services/hooks/private', () => ({
  useGetGoalsData: jest.fn(),
  useSaveGoalData: jest.fn(),
  useDeleteGoalData: jest.fn(),
}));

// Mock Zustand App Store
const mockUpdateGoals = jest.fn();
const mockRemoveGoals = jest.fn();

jest.mock('@store', () => {
  const mockState = {
    Goals: {
      goalsData: [
        {
          title: 'Learn Kubernetes',
          subtitle: 'K8s certification prep',
          tags: ['devops'],
          details: 'Prepare for CKA certification exam',
          timeline: ['Watch course lectures', 'Practice labs'],
          status: 'Pending',
          ranking: 1,
          createdAt: '2026-06-28T00:00:00.000Z',
          updatedAt: '2026-06-28T00:00:00.000Z',
        },
      ],
      updateGoals: mockUpdateGoals,
      removeGoals: mockRemoveGoals,
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

describe('GoalsScreen component', () => {
  let mockMutateSave: jest.Mock;
  let mockMutateDelete: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    const { appStore } = require('@store');
    (appStore as jest.Mock).mockImplementation((selector: any) => {
      return selector({
        Goals: {
          goalsData: [
            {
              title: 'Learn Kubernetes',
              subtitle: 'K8s certification prep',
              tags: ['devops'],
              details: 'Prepare for CKA certification exam',
              timeline: ['Watch course lectures', 'Practice labs'],
              status: 'Pending',
              ranking: 1,
              createdAt: '2026-06-28T00:00:00.000Z',
              updatedAt: '2026-06-28T00:00:00.000Z',
            },
          ],
          updateGoals: mockUpdateGoals,
          removeGoals: mockRemoveGoals,
        },
      });
    });

    (useGetGoalsData as jest.Mock).mockReturnValue({
      isLoading: false,
      data: [
        {
          title: 'Learn Kubernetes',
          subtitle: 'K8s certification prep',
          tags: ['devops'],
          details: 'Prepare for CKA certification exam',
          timeline: ['Watch course lectures', 'Practice labs'],
          status: 'Pending',
          ranking: 1,
          createdAt: '2026-06-28T00:00:00.000Z',
          updatedAt: '2026-06-28T00:00:00.000Z',
        },
      ],
    });

    mockMutateSave = jest.fn().mockResolvedValue(undefined);
    (useSaveGoalData as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateSave,
      isPending: false,
    });

    mockMutateDelete = jest.fn().mockResolvedValue(undefined);
    (useDeleteGoalData as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateDelete,
      isPending: false,
    });
  });

  it('renders title and goals list cards', () => {
    renderWithProviders(<GoalsScreen />);

    expect(screen.getByText('Goals')).toBeInTheDocument();
    expect(screen.getAllByText('Learn Kubernetes')[0]).toBeInTheDocument();
    expect(screen.getByText('K8s certification prep')).toBeInTheDocument();
    expect(screen.getByText('devops')).toBeInTheDocument();
  });

  it('opens add goals dialog on clicking add button', async () => {
    renderWithProviders(<GoalsScreen />);

    const addBtn = screen.getByRole('button', { name: /Add Goal/i });
    fireEvent.click(addBtn);

    // Dialog should open
    expect(await screen.findByText('Add Goal')).toBeInTheDocument();
  });

  it('validates empty inputs and submits valid data on save', async () => {
    renderWithProviders(<GoalsScreen />);

    const addBtn = screen.getByRole('button', { name: /Add Goal/i });
    fireEvent.click(addBtn);

    const titleInput = await screen.findByPlaceholderText(/e.g. Learn System Design/i);
    const detailsInput = screen.getByPlaceholderText(/Break down what you need to study/i);
    const saveBtn = screen.getByRole('button', { name: 'Save' });

    fireEvent.click(saveBtn);

    // Validation should prevent submission
    expect(await screen.findByText('Title is required.')).toBeInTheDocument();
    expect(mockMutateSave).not.toHaveBeenCalled();

    // Fill valid data
    fireEvent.change(titleInput, { target: { value: 'New Custom Goal' } });
    fireEvent.change(detailsInput, { target: { value: 'Details of the new custom goal' } });

    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockMutateSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Custom Goal',
          details: 'Details of the new custom goal',
          status: 'Pending',
        }),
      );
    });
  });

  it('opens deletion modal and performs delete confirmation on Yes', async () => {
    renderWithProviders(<GoalsScreen />);

    const deleteBtn = screen.getByRole('button', { name: /Delete Goal/i });
    fireEvent.click(deleteBtn);

    // Delete dialog should be visible
    expect(await screen.findByText('Confirm Deletion')).toBeInTheDocument();
    expect(screen.getAllByText('Learn Kubernetes')[0]).toBeInTheDocument();

    const yesBtn = screen.getByRole('button', { name: 'Yes' });
    fireEvent.click(yesBtn);

    await waitFor(() => {
      expect(mockMutateDelete).toHaveBeenCalledWith('Learn Kubernetes');
    });
  });

  it('shows no matching results empty state when search query does not match', () => {
    renderWithProviders(<GoalsScreen />);

    const searchInput = screen.getByPlaceholderText(/Search goals, tags/i);
    fireEvent.change(searchInput, { target: { value: 'UnmatchedQueryString' } });

    expect(screen.getByText('No matching results')).toBeInTheDocument();
    expect(
      screen.getByText(/Try adjusting your search query or clearing the filter/i),
    ).toBeInTheDocument();
  });

  it('shows no goals empty state when user has no goals', () => {
    const { appStore } = require('@store');
    (appStore as jest.Mock).mockImplementation((selector: any) => {
      return selector({
        Goals: {
          goalsData: [],
          updateGoals: mockUpdateGoals,
          removeGoals: mockRemoveGoals,
        },
      });
    });

    renderWithProviders(<GoalsScreen />);

    expect(screen.getByText('No goals found')).toBeInTheDocument();
    expect(screen.getByText(/Click "Add Goal" to create your first goal/i).parentElement).toBeInTheDocument();
  });

  it('can toggle between card and list view modes', async () => {
    renderWithProviders(<GoalsScreen />);

    // By default, cards are rendered in Grid (card view)
    expect(screen.getAllByText('Learn Kubernetes')[0]).toBeInTheDocument();

    // Switch to List View
    const listViewBtn = screen.getByRole('button', { name: /List View/i });
    fireEvent.click(listViewBtn);

    // In list view, milestones have LuCalendar next to them
    expect(screen.queryByText('Read DDIA book')).not.toBeInTheDocument();
    expect(screen.getByText('Watch course lectures')).toBeInTheDocument();

    // Switch back to Card View
    const cardViewBtn = screen.getByRole('button', { name: /Card View/i });
    fireEvent.click(cardViewBtn);

    expect(screen.getAllByText('Learn Kubernetes')[0]).toBeInTheDocument();
  });

  it('supports drag and drop reordering of goals', async () => {
    const { appStore } = require('@store');
    (appStore as jest.Mock).mockImplementation((selector: any) => {
      return selector({
        Goals: {
          goalsData: [
            {
              title: 'Learn Kubernetes',
              subtitle: 'K8s certification prep',
              tags: ['devops'],
              details: 'Prepare for CKA certification exam',
              timeline: ['Watch course lectures', 'Practice labs'],
              status: 'Pending',
              ranking: 1,
              createdAt: '2026-06-28T00:00:00.000Z',
              updatedAt: '2026-06-28T00:00:00.000Z',
            },
            {
              title: 'Learn React',
              subtitle: 'Advanced UI patterns',
              tags: ['frontend'],
              details: 'Learn custom hooks, performance tips',
              timeline: ['Read React docs'],
              status: 'In-Progress',
              ranking: 2,
              createdAt: '2026-06-28T00:00:00.000Z',
              updatedAt: '2026-06-28T00:00:00.000Z',
            },
          ],
          updateGoals: mockUpdateGoals,
          removeGoals: mockRemoveGoals,
        },
      });
    });

    (useGetGoalsData as jest.Mock).mockReturnValue({
      isLoading: false,
      data: [
        {
          title: 'Learn Kubernetes',
          subtitle: 'K8s prep',
          tags: [],
          details: 'Prepare for exam',
          timeline: [],
          status: 'Pending',
          ranking: 1,
          createdAt: '2026-06-28T00:00:00.000Z',
          updatedAt: '2026-06-28T00:00:00.000Z',
        },
        {
          title: 'Learn React',
          subtitle: 'React pattern prep',
          tags: [],
          details: 'Learn react',
          timeline: [],
          status: 'In-Progress',
          ranking: 2,
          createdAt: '2026-06-28T00:00:00.000Z',
          updatedAt: '2026-06-28T00:00:00.000Z',
        },
      ],
    });

    renderWithProviders(<GoalsScreen />);

    // Find the draggable items (GoalCard containers)
    const cards = screen.getAllByText(/Learn/i);
    expect(cards.length).toBeGreaterThanOrEqual(2);

    // Simulate drag start, drag over, and drop
    const firstCard = screen.getByText('Learn Kubernetes').closest('[draggable]');
    const secondCard = screen.getByText('Learn React').closest('[draggable]');

    expect(firstCard).toHaveAttribute('draggable', 'true');
    expect(secondCard).toHaveAttribute('draggable', 'true');

    act(() => {
      fireEvent.dragStart(firstCard!, { dataTransfer: { effectAllowed: 'move' } });
      fireEvent.dragOver(secondCard!);
      fireEvent.drop(secondCard!);
    });

    await waitFor(() => {
      // Reordering moves the first goal (Learn Kubernetes) to index 1, meaning its rank changes to 2.
      // And the second goal (Learn React) to index 0, meaning its rank changes to 1.
      expect(mockMutateSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Learn React',
          ranking: 1,
        }),
      );
      expect(mockMutateSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Learn Kubernetes',
          ranking: 2,
        }),
      );
    });
  });
});
