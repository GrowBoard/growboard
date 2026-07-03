import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../testUtils/renderUtils';
import ResourcesScreen from '../ResourcesScreen';
import {
  useGetResourcesData,
  useSaveResourceData,
  useDeleteResourceData,
} from '@services/hooks/private';
import { ResourceItem } from '@store';

// Mock the React Query hooks
jest.mock('@services/hooks/private', () => ({
  useGetResourcesData: jest.fn(),
  useSaveResourceData: jest.fn(),
  useDeleteResourceData: jest.fn(),
}));

// Mock Zustand App Store
const mockUpdateResources = jest.fn();
const mockRemoveResources = jest.fn();

const mockResourceItem: ResourceItem = {
  Id: 'res-1',
  title: 'React Docs',
  subtitle: 'Official documentation',
  link: 'https://react.dev',
  tags: ['React', 'Frontend'],
  about_resource: 'Official React core documentation.',
};

jest.mock('@store', () => {
  const mockState = {
    Resources: {
      resourcesData: [
        {
          Id: 'res-1',
          title: 'React Docs',
          subtitle: 'Official documentation',
          link: 'https://react.dev',
          tags: ['React', 'Frontend'],
          about_resource: 'Official React core documentation.',
        },
      ],
      updateResources: mockUpdateResources,
      removeResources: mockRemoveResources,
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

describe('ResourcesScreen component', () => {
  let mockMutateSave: jest.Mock;
  let mockMutateDelete: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    const { appStore } = require('@store');
    (appStore as jest.Mock).mockImplementation((selector: any) => {
      return selector({
        Resources: {
          resourcesData: [mockResourceItem],
          updateResources: mockUpdateResources,
          removeResources: mockRemoveResources,
        },
      });
    });

    (useGetResourcesData as jest.Mock).mockReturnValue({
      isLoading: false,
      data: {
        data: [mockResourceItem],
        status: 'SUCCESS',
        successMessage: 'Success',
      },
    });

    mockMutateSave = jest.fn().mockResolvedValue(undefined);
    (useSaveResourceData as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateSave,
      isPending: false,
    });

    mockMutateDelete = jest.fn().mockResolvedValue(undefined);
    (useDeleteResourceData as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateDelete,
      isPending: false,
    });
  });

  it('renders title and resources list cards', () => {
    renderWithProviders(<ResourcesScreen />);

    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('React Docs')).toBeInTheDocument();
    expect(screen.getByText('Official documentation')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open Link' })).toHaveAttribute(
      'href',
      'https://react.dev',
    );
  });

  it('opens add resource drawer on clicking add button', () => {
    renderWithProviders(<ResourcesScreen />);

    const addBtn = screen.getByRole('button', { name: 'Add Resource' });
    fireEvent.click(addBtn);

    expect(screen.getByText('Add Resource')).toBeInTheDocument();
  });

  it('shows no matching results empty state when search query does not match', () => {
    renderWithProviders(<ResourcesScreen />);

    const searchInput = screen.getByPlaceholderText(
      /Search resources by title, subtitle, link, tags.../i,
    );
    fireEvent.change(searchInput, { target: { value: 'non-existent' } });

    expect(screen.getByText('No matching resources')).toBeInTheDocument();
  });

  it('shows no resources empty state when user has no resources', () => {
    const { appStore } = require('@store');
    (appStore as jest.Mock).mockImplementation((selector: any) => {
      return selector({
        Resources: {
          resourcesData: [],
          updateResources: mockUpdateResources,
          removeResources: mockRemoveResources,
        },
      });
    });

    renderWithProviders(<ResourcesScreen />);
    expect(screen.getByText(/No resources found/i)).toBeInTheDocument();
  });
});
