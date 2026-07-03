import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../testUtils/renderUtils';
import ProjectScreen from '../ProjectScreen';
import {
  useGetProjectsData,
  useSaveProjectData,
  useDeleteProjectData,
} from '@services/hooks/private';
import { ProjectItem } from '@store';

// Mock the React Query hooks
jest.mock('@services/hooks/private', () => ({
  useGetProjectsData: jest.fn(),
  useSaveProjectData: jest.fn(),
  useDeleteProjectData: jest.fn(),
}));

// Mock Zustand App Store
const mockAddProjects = jest.fn();
const mockRemoveProjectsState = jest.fn();

const mockProjectItem: ProjectItem = {
  Id: 'project-1',
  title: 'GrowBoard Portal',
  subtitle: 'Modern management dashboard',
  link: 'https://github.com/GrowBoard',
  tags: ['React', 'TypeScript'],
  about_project: 'Comprehensive dashboard tool.',
  remark: 'Self-hosted environment.',
  owner: 'Amit Raikwar',
  status: 'started',
};

jest.mock('@store', () => {
  const mockState = {
    Projects: {
      projects: [
        {
          Id: 'project-1',
          title: 'GrowBoard Portal',
          subtitle: 'Modern management dashboard',
          link: 'https://github.com/GrowBoard',
          tags: ['React', 'TypeScript'],
          about_project: 'Comprehensive dashboard tool.',
          remark: 'Self-hosted environment.',
          owner: 'Amit Raikwar',
          status: 'started',
        },
      ],
      addProjects: mockAddProjects,
      removeProjectsState: mockRemoveProjectsState,
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

describe('ProjectScreen component', () => {
  let mockMutateSave: jest.Mock;
  let mockMutateDelete: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    const { appStore } = require('@store');
    (appStore as jest.Mock).mockImplementation((selector: any) => {
      return selector({
        Projects: {
          projects: [mockProjectItem],
          addProjects: mockAddProjects,
          removeProjectsState: mockRemoveProjectsState,
        },
      });
    });

    (useGetProjectsData as jest.Mock).mockReturnValue({
      isLoading: false,
      data: {
        data: [mockProjectItem],
        status: 'SUCCESS',
        successMessage: 'Success',
      },
    });

    mockMutateSave = jest.fn().mockResolvedValue(undefined);
    (useSaveProjectData as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateSave,
      isPending: false,
    });

    mockMutateDelete = jest.fn().mockResolvedValue(undefined);
    (useDeleteProjectData as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateDelete,
      isPending: false,
    });
  });

  it('renders title and projects list cards', () => {
    renderWithProviders(<ProjectScreen />);

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('GrowBoard Portal')).toBeInTheDocument();
    expect(screen.getByText('Modern management dashboard')).toBeInTheDocument();
    expect(screen.getByText('STARTED')).toBeInTheDocument();
  });

  it('opens add project drawer on clicking add button', () => {
    renderWithProviders(<ProjectScreen />);

    const addBtn = screen.getByRole('button', { name: 'Add Project' });
    fireEvent.click(addBtn);

    expect(screen.getByText('Add Project')).toBeInTheDocument();
  });

  it('shows no matching results empty state when search query does not match', () => {
    renderWithProviders(<ProjectScreen />);

    const searchInput = screen.getByPlaceholderText(/Search projects by title, status, owner.../i);
    fireEvent.change(searchInput, { target: { value: 'non-existent' } });

    expect(screen.getByText('No matching projects')).toBeInTheDocument();
  });

  it('shows no projects empty state when user has no projects', () => {
    const { appStore } = require('@store');
    (appStore as jest.Mock).mockImplementation((selector: any) => {
      return selector({
        Projects: {
          projects: [],
          addProjects: mockAddProjects,
          removeProjectsState: mockRemoveProjectsState,
        },
      });
    });

    renderWithProviders(<ProjectScreen />);
    expect(screen.getByText(/No projects found/i)).toBeInTheDocument();
  });

  it('toggles view to list mode on clicking List View button', () => {
    renderWithProviders(<ProjectScreen />);

    const listViewBtn = screen.getByRole('button', { name: 'List View' });
    fireEvent.click(listViewBtn);

    // List View button is now clicked; card view button still exists
    expect(screen.getByRole('button', { name: 'Card View' })).toBeInTheDocument();
  });

  it('toggles view back to card mode after switching to list mode', () => {
    renderWithProviders(<ProjectScreen />);

    const listViewBtn = screen.getByRole('button', { name: 'List View' });
    fireEvent.click(listViewBtn);

    const cardViewBtn = screen.getByRole('button', { name: 'Card View' });
    fireEvent.click(cardViewBtn);

    expect(screen.getByText('GrowBoard Portal')).toBeInTheDocument();
  });

  it('shows spinner when isLoading is true', () => {
    (useGetProjectsData as jest.Mock).mockReturnValue({
      isLoading: true,
    });

    renderWithProviders(<ProjectScreen />);
    // Spinner rendered, no project cards shown
    expect(screen.queryByText('GrowBoard Portal')).not.toBeInTheDocument();
  });
});
