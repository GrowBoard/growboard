import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import GoalCard from '../GoalCard';
import { GoalItem } from '@store';

describe('GoalCard component', () => {
  const mockItem: GoalItem = {
    title: 'Learn System Design',
    subtitle: 'Understand scalable architectures',
    tags: ['tech', 'architecture'],
    details:
      'Study microservices, replication, partitioning, and consensus protocols like Raft.',
    timeline: ['Read DDIA book', 'Watch online system design lectures'],
    status: 'In-Progress',
    ranking: 1,
    createdAt: '2026-06-28T00:00:00.000Z',
    updatedAt: '2026-06-28T00:00:00.000Z',
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders goal details, tags, and timeline milestones correctly in card mode', () => {
    renderWithProviders(
      <GoalCard
        item={mockItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        viewMode="card"
      />,
    );

    expect(screen.getByText('Learn System Design')).toBeInTheDocument();
    expect(
      screen.getByText('Understand scalable architectures'),
    ).toBeInTheDocument();
    expect(screen.getByText('tech')).toBeInTheDocument();
    expect(screen.getByText('architecture')).toBeInTheDocument();
    expect(screen.getByText('In-Progress')).toBeInTheDocument();
    expect(screen.getByText('Rank #1')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Study microservices, replication, partitioning, and consensus/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Read DDIA book')).toBeInTheDocument();
    expect(
      screen.getByText('Watch online system design lectures'),
    ).toBeInTheDocument();
  });

  it('renders correctly in list view mode', () => {
    renderWithProviders(
      <GoalCard
        item={mockItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        viewMode="list"
      />,
    );

    expect(screen.getByText('Learn System Design')).toBeInTheDocument();
    expect(
      screen.getByText('Understand scalable architectures'),
    ).toBeInTheDocument();
    expect(screen.getByText('tech')).toBeInTheDocument();
    expect(screen.getByText('architecture')).toBeInTheDocument();
    expect(screen.getByText('In-Progress')).toBeInTheDocument();
    expect(screen.getByText('Rank #1')).toBeInTheDocument();
    // In list view noOfLines={2} applies but element exists in DOM
    expect(
      screen.getByText(
        /Study microservices, replication, partitioning, and consensus/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Read DDIA book')).toBeInTheDocument();
    expect(
      screen.getByText('Watch online system design lectures'),
    ).toBeInTheDocument();
  });

  it('triggers edit and delete actions when buttons are clicked', () => {
    renderWithProviders(
      <GoalCard
        item={mockItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        viewMode="card"
      />,
    );

    const editBtn = screen.getByRole('button', { name: /Edit Goal/i });
    fireEvent.click(editBtn);
    expect(mockOnEdit).toHaveBeenCalledWith('Learn System Design');

    const deleteBtn = screen.getByRole('button', { name: /Delete Goal/i });
    fireEvent.click(deleteBtn);
    expect(mockOnDelete).toHaveBeenCalledWith('Learn System Design');
  });

  it('handles long details collapse and expansion correctly', () => {
    const longDetailsItem: GoalItem = {
      ...mockItem,
      details: 'A'.repeat(200), // longer than 150 limit
    };

    renderWithProviders(
      <GoalCard
        item={longDetailsItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        viewMode="card"
      />,
    );

    // Should show truncated details
    const truncatedText = `${'A'.repeat(150)}...`;
    expect(screen.getByText(truncatedText)).toBeInTheDocument();

    const showMoreBtn = screen.getByRole('button', { name: /Show More/i });
    fireEvent.click(showMoreBtn);

    // Should show full details
    expect(screen.getByText('A'.repeat(200))).toBeInTheDocument();

    const showLessBtn = screen.getByRole('button', { name: /Show Less/i });
    fireEvent.click(showLessBtn);

    // Should show truncated details again
    expect(screen.getByText(truncatedText)).toBeInTheDocument();
  });
});
