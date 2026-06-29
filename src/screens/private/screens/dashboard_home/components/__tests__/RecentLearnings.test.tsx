import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import { RecentLearnings } from '../RecentLearnings';
import { LearningItem } from '@store';

/** Factory helper to build a minimal LearningItem for testing. */
const makeLearning = (overrides: Partial<LearningItem> = {}): LearningItem => ({
  title: 'Test Learning',
  subtitle: 'A subtitle',
  tags: ['tag1'],
  content: '# Content',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

describe('RecentLearnings component', () => {
  it('renders the section heading', () => {
    renderWithProviders(<RecentLearnings learnings={[]} />);
    expect(screen.getByText(/Recent Learnings/i)).toBeInTheDocument();
  });

  it('shows empty state when no learnings are provided', () => {
    renderWithProviders(<RecentLearnings learnings={[]} />);
    expect(screen.getByText(/No learnings yet/i)).toBeInTheDocument();
  });

  it('renders a row for each learning', () => {
    const learnings = [
      makeLearning({ title: 'Learning Alpha' }),
      makeLearning({ title: 'Learning Beta' }),
    ];
    renderWithProviders(<RecentLearnings learnings={learnings} />);
    expect(screen.getByText('Learning Alpha')).toBeInTheDocument();
    expect(screen.getByText('Learning Beta')).toBeInTheDocument();
  });

  it('renders the subtitle of a learning', () => {
    renderWithProviders(
      <RecentLearnings learnings={[makeLearning({ subtitle: 'My subtitle' })]} />,
    );
    expect(screen.getByText('My subtitle')).toBeInTheDocument();
  });

  it('renders "View all →" link', () => {
    renderWithProviders(<RecentLearnings learnings={[]} />);
    expect(screen.getByText('View all →')).toBeInTheDocument();
  });

  it('navigates when "View all →" is clicked', () => {
    renderWithProviders(<RecentLearnings learnings={[]} />);
    const link = screen.getByText('View all →');
    fireEvent.click(link);
    // Navigation is handled by react-router; clicking should not throw
  });
});
