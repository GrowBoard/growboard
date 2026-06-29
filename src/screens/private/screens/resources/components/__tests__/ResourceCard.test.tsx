import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import ResourceCard from '../ResourceCard';
import { ResourceItem } from '@store';

describe('ResourceCard component', () => {
  const mockItem: ResourceItem = {
    Id: 'res-123',
    title: 'Chakra UI v3 Docs',
    subtitle: 'Official documentation for component styling library',
    link: 'https://chakra-ui.com',
    tags: ['styling', 'UI'],
    about_resource: 'Chakra UI provides accessible UI building blocks.',
  };

  const mockOnDelete = jest.fn();
  const mockOnViewAbout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders resource details, tags and link icon correctly in card view', () => {
    renderWithProviders(
      <ResourceCard
        item={mockItem}
        resourceIdx={0}
        onDelete={mockOnDelete}
        onViewAbout={mockOnViewAbout}
        viewMode="card"
      />,
    );

    expect(screen.getByText('Chakra UI v3 Docs')).toBeInTheDocument();
    expect(screen.getByText('Official documentation for component styling library')).toBeInTheDocument();
    expect(screen.getByText('styling')).toBeInTheDocument();
    expect(screen.getByText('UI')).toBeInTheDocument();

    // Link icon is rendered, but no direct URL link text is shown as a text label.
    // However, the anchor node has the link as its href attribute.
    const linkIcon = screen.getByRole('link', { name: 'Open Link' });
    expect(linkIcon).toHaveAttribute('href', 'https://chakra-ui.com');

    // Does NOT render the about text inline
    expect(screen.queryByText('Chakra UI provides accessible UI building blocks.')).not.toBeInTheDocument();

    // View Support button is displayed
    const viewSupportBtn = screen.getByRole('button', { name: 'See resource content' });
    expect(viewSupportBtn).toBeInTheDocument();
  });

  it('renders resource details correctly in list view', () => {
    renderWithProviders(
      <ResourceCard
        item={mockItem}
        resourceIdx={0}
        onDelete={mockOnDelete}
        onViewAbout={mockOnViewAbout}
        viewMode="list"
      />,
    );

    expect(screen.getByText('Chakra UI v3 Docs')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'See resource content' })).toBeInTheDocument();
  });

  it('calls onViewAbout when View Support button is clicked', () => {
    renderWithProviders(
      <ResourceCard
        item={mockItem}
        resourceIdx={0}
        onDelete={mockOnDelete}
        onViewAbout={mockOnViewAbout}
        viewMode="card"
      />,
    );

    const viewSupportBtn = screen.getByRole('button', { name: 'See resource content' });
    fireEvent.click(viewSupportBtn);
    expect(mockOnViewAbout).toHaveBeenCalledWith(mockItem);
  });

  it('calls onDelete when delete button is clicked', () => {
    renderWithProviders(
      <ResourceCard
        item={mockItem}
        resourceIdx={0}
        onDelete={mockOnDelete}
        onViewAbout={mockOnViewAbout}
        viewMode="card"
      />,
    );

    const deleteBtn = screen.getByRole('button', { name: 'Delete resource' });
    fireEvent.click(deleteBtn);
    expect(mockOnDelete).toHaveBeenCalledWith('res-123');
  });
});
