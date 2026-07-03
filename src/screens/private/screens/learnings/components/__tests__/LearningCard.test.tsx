import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import LearningCard from '../LearningCard';
import { LearningItem } from '@store';

describe('LearningCard component', () => {
  const mockItem: LearningItem = {
    title: 'Learn System Design',
    subtitle: 'Understand scalable architectures',
    tags: ['tech', 'architecture'],
    content: '# System Design\nStudy microservices.',
    createdAt: '2026-06-28T00:00:00.000Z',
    updatedAt: '2026-06-28T00:00:00.000Z',
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnPreview = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders learning details and tags correctly', () => {
    renderWithProviders(
      <LearningCard
        item={mockItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onPreview={mockOnPreview}
      />,
    );

    expect(screen.getByText('Learn System Design')).toBeInTheDocument();
    expect(
      screen.getByText('Understand scalable architectures'),
    ).toBeInTheDocument();
    expect(screen.getByText('tech')).toBeInTheDocument();
    expect(screen.getByText('architecture')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    renderWithProviders(
      <LearningCard
        item={mockItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onPreview={mockOnPreview}
      />,
    );

    const editBtn = screen.getByRole('button', { name: 'Edit Learning' });
    fireEvent.click(editBtn);
    expect(mockOnEdit).toHaveBeenCalledWith(mockItem);
  });

  it('calls onDelete when delete button is clicked', () => {
    renderWithProviders(
      <LearningCard
        item={mockItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onPreview={mockOnPreview}
      />,
    );

    const deleteBtn = screen.getByRole('button', { name: 'Delete Learning' });
    fireEvent.click(deleteBtn);
    expect(mockOnDelete).toHaveBeenCalledWith(mockItem.title);
  });

  it('calls onPreview when preview button is clicked', () => {
    renderWithProviders(
      <LearningCard
        item={mockItem}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onPreview={mockOnPreview}
      />,
    );

    const previewBtn = screen.getByRole('button', { name: 'Preview Learning' });
    fireEvent.click(previewBtn);
    expect(mockOnPreview).toHaveBeenCalledWith(mockItem);
  });
});
