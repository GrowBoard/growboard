import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import LearningFormDrawer from '../LearningFormDrawer';
import { LearningItem } from '@store';

describe('LearningFormDrawer component', () => {
  const mockEditItem: LearningItem = {
    title: 'Learn System Design',
    subtitle: 'Understand scalable architectures',
    tags: ['tech'],
    content: '# System Design\nStudy microservices.',
    createdAt: '2026-06-28T00:00:00.000Z',
    updatedAt: '2026-06-28T00:00:00.000Z',
  };

  const mockOnSave = jest.fn();
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders add mode drawer correctly', () => {
    renderWithProviders(
      <LearningFormDrawer
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        editItem={null}
        onSave={mockOnSave}
        isSaving={false}
        existingTitles={[]}
      />,
    );

    expect(screen.getByText('Add Learning')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Topic Title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Topic Subtitle/i)).toBeInTheDocument();
  });

  it('renders edit mode drawer correctly with pre-filled values', () => {
    renderWithProviders(
      <LearningFormDrawer
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        editItem={mockEditItem}
        onSave={mockOnSave}
        isSaving={false}
        existingTitles={['Learn System Design']}
      />,
    );

    expect(screen.getByText('Edit Learning')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Learn System Design')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Understand scalable architectures')).toBeInTheDocument();
  });

  it('submits successfully when fields are valid', async () => {
    renderWithProviders(
      <LearningFormDrawer
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        editItem={null}
        onSave={mockOnSave}
        isSaving={false}
        existingTitles={[]}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/e.g. Topic Title/i), {
      target: { value: 'New Test Learning' },
    });
    fireEvent.change(screen.getByPlaceholderText(/e.g. Topic Subtitle/i), {
      target: { value: 'New Subtitle' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Type your markdown content here/i), {
      target: { value: 'New content here.' },
    });

    const saveBtn = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    const calls = mockOnSave.mock.calls;
    expect(calls[0][0].title).toBe('New Test Learning');
    expect(calls[0][0].subtitle).toBe('New Subtitle');
    expect(calls[0][0].content).toBe('New content here.');
  });
});
