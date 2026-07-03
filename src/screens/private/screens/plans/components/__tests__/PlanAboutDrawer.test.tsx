import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import PlanAboutDrawer from '../PlanAboutDrawer';
import { PlanItem } from '@store';

describe('PlanAboutDrawer component', () => {
  const mockOnOpenChange = jest.fn();

  const mockItem: PlanItem = {
    Id: 'p-1',
    title: 'Work on Project Alpha',
    subtitle: 'Important milestone',
    date: '2026-07-03',
    time: '14:00',
    tags: ['work', 'coding'],
    about_plan: 'Implement the dashboard page layout.',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when item is null', () => {
    const { container } = renderWithProviders(
      <PlanAboutDrawer isOpen={true} onOpenChange={mockOnOpenChange} item={null} />,
    );
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('renders item details when open and item is provided', () => {
    renderWithProviders(
      <PlanAboutDrawer isOpen={true} onOpenChange={mockOnOpenChange} item={mockItem} />,
    );

    expect(screen.getByText('Work on Project Alpha')).toBeInTheDocument();
    expect(screen.getByText('Important milestone')).toBeInTheDocument();
    expect(screen.getByText('2026-07-03')).toBeInTheDocument();
    expect(screen.getByText('14:00')).toBeInTheDocument();
    expect(screen.getByText('work')).toBeInTheDocument();
    expect(screen.getByText('coding')).toBeInTheDocument();
    expect(screen.getByText('Implement the dashboard page layout.')).toBeInTheDocument();
  });

  it('renders fallback when about_plan is empty', () => {
    const itemWithoutAbout = {
      ...mockItem,
      about_plan: '',
    };
    renderWithProviders(
      <PlanAboutDrawer isOpen={true} onOpenChange={mockOnOpenChange} item={itemWithoutAbout} />,
    );
    expect(screen.getByText('No details provided.')).toBeInTheDocument();
  });
});
