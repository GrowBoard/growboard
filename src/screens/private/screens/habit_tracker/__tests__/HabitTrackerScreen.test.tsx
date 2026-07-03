import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../testUtils/renderUtils';
import HabitTrackerScreen from '../HabitTrackerScreen';
import {
  useGetHabitsData,
  useGetHabitLogsData,
  useSaveHabitData,
  useDeleteHabitData,
  useUpsertHabitLog,
} from '@services/hooks/private';

jest.mock('@services/hooks/private', () => ({
  useGetHabitsData: jest.fn(),
  useGetHabitLogsData: jest.fn(),
  useSaveHabitData: jest.fn(),
  useDeleteHabitData: jest.fn(),
  useUpsertHabitLog: jest.fn(),
}));

describe('HabitTrackerScreen component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useGetHabitsData as jest.Mock).mockReturnValue({ isLoading: false });
    (useGetHabitLogsData as jest.Mock).mockReturnValue({ isLoading: false });
    (useSaveHabitData as jest.Mock).mockReturnValue({ mutateAsync: jest.fn() });
    (useDeleteHabitData as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
    });
    (useUpsertHabitLog as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(),
    });
  });

  it('renders loading spinner when queries are loading', () => {
    (useGetHabitsData as jest.Mock).mockReturnValue({ isLoading: true });

    renderWithProviders(<HabitTrackerScreen />);

    expect(
      screen.getByText('Loading data from Google Drive...'),
    ).toBeInTheDocument();
  });

  it('renders title, subtitle, and control buttons when loaded', () => {
    renderWithProviders(<HabitTrackerScreen />);

    expect(screen.getByText('Habit Tracker')).toBeInTheDocument();
    expect(
      screen.getByText('Track daily consistency and visual heat-map progress'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Start Habit' }),
    ).toBeInTheDocument();
  });

  it('opens Start Habit modal when start button is clicked', async () => {
    renderWithProviders(<HabitTrackerScreen />);

    const startBtn = screen.getByRole('button', { name: 'Start Habit' });
    fireEvent.click(startBtn);

    expect(await screen.findByText('Start a Habit')).toBeInTheDocument();
  });
});
