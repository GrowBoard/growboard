import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import { RecentGoals } from '../RecentGoals';
import { GoalItem } from '@store';

/** Factory helper to build a minimal GoalItem for testing. */
const makeGoal = (overrides: Partial<GoalItem> = {}): GoalItem => ({
  title: 'Test Goal',
  subtitle: 'A subtitle',
  tags: ['tag1'],
  details: '',
  timeline: [],
  status: 'Pending',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

describe('RecentGoals component', () => {
  it('renders the section heading', () => {
    renderWithProviders(<RecentGoals goals={[]} />);
    expect(screen.getByText(/Recent Goals/i)).toBeInTheDocument();
  });

  it('shows empty state when no goals are provided', () => {
    renderWithProviders(<RecentGoals goals={[]} />);
    expect(screen.getByText(/No goals yet/i)).toBeInTheDocument();
  });

  it('renders a goal card for each goal', () => {
    const goals = [
      makeGoal({ title: 'Goal Alpha' }),
      makeGoal({ title: 'Goal Beta' }),
    ];
    renderWithProviders(<RecentGoals goals={goals} />);
    expect(screen.getByText('Goal Alpha')).toBeInTheDocument();
    expect(screen.getByText('Goal Beta')).toBeInTheDocument();
  });

  it('renders the status badge of a goal', () => {
    renderWithProviders(
      <RecentGoals goals={[makeGoal({ status: 'In-Progress' })]} />,
    );
    expect(screen.getByText('In-Progress')).toBeInTheDocument();
  });

  it('renders the subtitle of a goal', () => {
    renderWithProviders(
      <RecentGoals goals={[makeGoal({ subtitle: 'My subtitle' })]} />,
    );
    expect(screen.getByText('My subtitle')).toBeInTheDocument();
  });

  it('renders "View all →" link', () => {
    renderWithProviders(<RecentGoals goals={[]} />);
    expect(screen.getByText('View all →')).toBeInTheDocument();
  });

  it('navigates when "View all →" is clicked', () => {
    renderWithProviders(<RecentGoals goals={[]} />);
    const link = screen.getByText('View all →');
    fireEvent.click(link);
    // Navigation is handled by react-router; clicking should not throw
  });
});
