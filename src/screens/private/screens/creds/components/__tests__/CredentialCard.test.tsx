import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import CredentialCard from '../CredentialCard';

describe('CredentialCard component', () => {
  const mockItem = {
    credTitle: 'AWS Production',
    credData: [
      { name: 'Username', value: 'admin' },
      { name: 'Password', value: 'secret123' },
    ],
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnCopyAsEnv = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it('renders credential title and masked fields by default', () => {
    renderWithProviders(
      <CredentialCard
        item={mockItem}
        credIdx={0}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCopyAsEnv={mockOnCopyAsEnv}
      />,
    );

    expect(screen.getByText('AWS Production')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();

    // Verify fields are masked initially
    expect(screen.queryByText('admin')).not.toBeInTheDocument();
    expect(screen.queryByText('secret123')).not.toBeInTheDocument();
  });

  it('toggles visibility of an individual field', () => {
    renderWithProviders(
      <CredentialCard
        item={mockItem}
        credIdx={0}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCopyAsEnv={mockOnCopyAsEnv}
      />,
    );

    const toggleButtons = screen.getAllByRole('button', {
      name: /Toggle Visibility/i,
    });
    // Toggle first field (Username)
    fireEvent.click(toggleButtons[0]);
    expect(screen.getByText('admin')).toBeInTheDocument();

    // Toggle again to hide
    fireEvent.click(toggleButtons[0]);
    expect(screen.queryByText('admin')).not.toBeInTheDocument();
  });

  it('toggles visibility of all fields using reveal/hide all button', () => {
    renderWithProviders(
      <CredentialCard
        item={mockItem}
        credIdx={0}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCopyAsEnv={mockOnCopyAsEnv}
      />,
    );

    const revealAllBtn = screen.getByRole('button', {
      name: /Toggle all visibility/i,
    });
    fireEvent.click(revealAllBtn);

    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('secret123')).toBeInTheDocument();

    // Toggle again to hide all
    fireEvent.click(revealAllBtn);
    expect(screen.queryByText('admin')).not.toBeInTheDocument();
    expect(screen.queryByText('secret123')).not.toBeInTheDocument();
  });

  it('calls edit, delete, and copyAsEnv callbacks', () => {
    renderWithProviders(
      <CredentialCard
        item={mockItem}
        credIdx={0}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCopyAsEnv={mockOnCopyAsEnv}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Edit Credential' }));
    expect(mockOnEdit).toHaveBeenCalledWith(0);

    fireEvent.click(screen.getByRole('button', { name: 'Delete Credential' }));
    expect(mockOnDelete).toHaveBeenCalledWith(0);

    fireEvent.click(screen.getByRole('button', { name: 'Copy all as env' }));
    expect(mockOnCopyAsEnv).toHaveBeenCalledWith(mockItem, 0);
  });
});
