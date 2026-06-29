import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import ResourceFormDrawer from '../ResourceFormDrawer';

describe('ResourceFormDrawer component', () => {
  const mockOnSave = jest.fn();
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders add mode drawer correctly', () => {
    renderWithProviders(
      <ResourceFormDrawer
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
        isSaving={false}
      />,
    );

    expect(screen.getByText('Add Resource')).toBeInTheDocument();
    expect(screen.getByLabelText(/Resource Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Resource Link/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/About Resource/i)).toBeInTheDocument();
  });

  it('validates empty inputs and reports error labels', async () => {
    renderWithProviders(
      <ResourceFormDrawer
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
        isSaving={false}
      />,
    );

    const saveBtn = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveBtn);

    // Validation messages should display
    expect(await screen.findByText('Title is required.')).toBeInTheDocument();
    expect(screen.getByText('Link is required.')).toBeInTheDocument();
    expect(screen.getByText('About content is required.')).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('validates link format', async () => {
    renderWithProviders(
      <ResourceFormDrawer
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
        isSaving={false}
      />,
    );

    const linkInput = screen.getByPlaceholderText(/e.g. https:\/\/example.com/i);
    fireEvent.change(linkInput, { target: { value: 'invalid-url' } });

    const saveBtn = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveBtn);

    expect(await screen.findByText('Please enter a valid URL.')).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('submits successfully when fields are valid', async () => {
    renderWithProviders(
      <ResourceFormDrawer
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        onSave={mockOnSave}
        isSaving={false}
      />,
    );

    const titleInput = screen.getByPlaceholderText(/e.g. Reference Title/i);
    const linkInput = screen.getByPlaceholderText(/e.g. https:\/\/example.com/i);
    const contentInput = screen.getByPlaceholderText(/Write description\/guides here.../i);

    fireEvent.change(titleInput, { target: { value: 'Valid Resource Title' } });
    fireEvent.change(linkInput, { target: { value: 'https://valid-url.com' } });
    fireEvent.change(contentInput, { target: { value: 'Valid About Content' } });

    const saveBtn = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    expect(mockOnSave).toHaveBeenCalledWith({
      title: 'Valid Resource Title',
      subtitle: '',
      link: 'https://valid-url.com',
      tags: [],
      about_resource: 'Valid About Content',
    });
  });
});
