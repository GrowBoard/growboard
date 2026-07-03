import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import PlanCard from '../PlanCard';

describe('PlanCard component', () => {
  const item = {
    Id: 'p1',
    title: 'Workout Routine',
    subtitle: 'Daily exercises',
    date: '2026-07-02',
    time: '08:00',
    tags: ['gym', 'health'],
    about_plan: 'Routine for muscle gain',
  };

  const defaultProps = {
    item,
    planIdx: 0,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onViewAbout: jest.fn(),
    viewMode: 'grid' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly in grid mode', () => {
    renderWithProviders(<PlanCard {...defaultProps} />);
    expect(screen.getByText('Workout Routine')).toBeInTheDocument();
    expect(screen.getByText('Daily exercises')).toBeInTheDocument();
    expect(screen.getByText('2026-07-02')).toBeInTheDocument();
    expect(screen.getByText('08:00')).toBeInTheDocument();
    expect(screen.getByText('gym')).toBeInTheDocument();
    expect(screen.getByText('health')).toBeInTheDocument();
    expect(screen.getByText('Routine for muscle gain')).toBeInTheDocument();
  });

  it('renders correctly in list mode', () => {
    renderWithProviders(<PlanCard {...defaultProps} viewMode="list" />);
    expect(screen.getByText('Workout Routine')).toBeInTheDocument();
    expect(screen.getByText('Daily exercises')).toBeInTheDocument();
    expect(screen.getByText('2026-07-02')).toBeInTheDocument();
    expect(screen.getByText('08:00')).toBeInTheDocument();
    expect(screen.getByText('gym')).toBeInTheDocument();
    expect(screen.getByText('health')).toBeInTheDocument();
    expect(screen.getByText('Routine for muscle gain')).toBeInTheDocument();
  });

  it('calls onViewAbout when View button clicked', () => {
    renderWithProviders(<PlanCard {...defaultProps} />);
    const viewBtn = screen.getByRole('button', { name: /View plan details/i });
    fireEvent.click(viewBtn);
    expect(defaultProps.onViewAbout).toHaveBeenCalledWith(item);
  });

  it('calls onEdit when Edit button clicked', () => {
    renderWithProviders(<PlanCard {...defaultProps} />);
    const editBtn = screen.getByRole('button', { name: /Edit plan/i });
    fireEvent.click(editBtn);
    expect(defaultProps.onEdit).toHaveBeenCalledWith(item);
  });

  it('calls onDelete when Delete button clicked', () => {
    renderWithProviders(<PlanCard {...defaultProps} />);
    const deleteBtn = screen.getByRole('button', { name: /Delete plan/i });
    fireEvent.click(deleteBtn);
    expect(defaultProps.onDelete).toHaveBeenCalledWith('p1');
  });
});
