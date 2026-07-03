import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../testUtils/renderUtils';
import LearningsScreen from '../LearningsScreen';
import {
  useGetLearningsData,
  useSaveLearningData,
  useDeleteLearningData,
} from '@services/hooks/private';

// Mock the React Query hooks
jest.mock('@services/hooks/private', () => ({
  useGetLearningsData: jest.fn(),
  useSaveLearningData: jest.fn(),
  useDeleteLearningData: jest.fn(),
}));

// Mock Zustand App Store
const mockUpdateLearnings = jest.fn();
const mockRemoveLearnings = jest.fn();

jest.mock('@store', () => {
  const mockState = {
    Learnings: {
      learningsData: [
        {
          title: 'Learn Kubernetes',
          subtitle: 'K8s certification prep',
          tags: ['devops'],
          content: '# Prepare for CKA certification exam',
          createdAt: '2026-06-28T00:00:00.000Z',
          updatedAt: '2026-06-28T00:00:00.000Z',
        },
      ],
      updateLearnings: mockUpdateLearnings,
      removeLearnings: mockRemoveLearnings,
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

describe('LearningsScreen component', () => {
  let mockMutateSave: jest.Mock;
  let mockMutateDelete: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockMutateSave = jest.fn().mockResolvedValue(undefined);
    mockMutateDelete = jest.fn().mockResolvedValue(undefined);

    (useGetLearningsData as jest.Mock).mockReturnValue({
      isLoading: false,
    });
    (useSaveLearningData as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateSave,
      isPending: false,
    });
    (useDeleteLearningData as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateDelete,
      isPending: false,
    });
  });

  it('renders learning items, search bar and create button', () => {
    renderWithProviders(<LearningsScreen />);

    expect(screen.getByText('Learnings')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Search by title, subtitle/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add Learning' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Learn Kubernetes')).toBeInTheDocument();
  });

  it('opens and submits the Add Learning drawer form', async () => {
    renderWithProviders(<LearningsScreen />);

    const addBtn = screen.getByRole('button', { name: 'Add Learning' });
    fireEvent.click(addBtn);

    // Form drawer is now open
    expect(await screen.findByText('Add Learning')).toBeInTheDocument();

    const titleInput = await screen.findByPlaceholderText(/e.g. Topic Title/i);
    const contentInput = await screen.findByPlaceholderText(
      /Type your markdown content here/i,
    );

    fireEvent.change(titleInput, {
      target: { value: 'New Test Learning' },
    });
    fireEvent.change(contentInput, {
      target: { value: 'Some content.' },
    });

    const saveBtn = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockMutateSave).toHaveBeenCalledTimes(1);
    });

    expect(mockMutateSave.mock.calls[0][0].learning.title).toBe(
      'New Test Learning',
    );
  });

  it('opens the delete confirmation dialogue and triggers delete action', async () => {
    renderWithProviders(<LearningsScreen />);

    const deleteBtn = screen.getByRole('button', { name: 'Delete Learning' });
    fireEvent.click(deleteBtn);

    // Confirmation dialog is open
    expect(await screen.findByText('Confirm Deletion')).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockMutateDelete).toHaveBeenCalledWith('Learn Kubernetes');
    });
  });
});
