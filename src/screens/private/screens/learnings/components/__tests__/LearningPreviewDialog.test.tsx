import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import LearningPreviewDialog from '../LearningPreviewDialog';

describe('LearningPreviewDialog component', () => {
  const item = {
    Id: 'l1',
    title: 'TypeScript Generics',
    subtitle: 'Advanced TS Concepts',
    tags: ['ts', 'js'],
    content: 'Generics are powerful tools in TS.\n\n- Flexible reuse\n- Strong types',
  };

  const defaultProps = {
    isOpen: true,
    onOpenChange: jest.fn(),
    item,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when item is null', () => {
    renderWithProviders(
      <LearningPreviewDialog isOpen={true} onOpenChange={jest.fn()} item={null as any} />,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title, subtitle, badges, and markdown content', () => {
    renderWithProviders(<LearningPreviewDialog {...defaultProps} />);
    expect(screen.getByText('TypeScript Generics')).toBeInTheDocument();
    expect(screen.getByText('Advanced TS Concepts')).toBeInTheDocument();
    expect(screen.getByText('ts')).toBeInTheDocument();
    expect(screen.getByText('js')).toBeInTheDocument();
    expect(screen.getByText('Generics are powerful tools in TS.')).toBeInTheDocument();
    expect(screen.getByText('Flexible reuse')).toBeInTheDocument();
  });

  it('calls onOpenChange with open false when Close button is clicked', () => {
    renderWithProviders(<LearningPreviewDialog {...defaultProps} />);
    const closeBtn = screen.getByRole('button', { name: /Cancel|Close/i });
    fireEvent.click(closeBtn);
    expect(defaultProps.onOpenChange).toHaveBeenCalledWith({ open: false });
  });
});
