import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import ResourceAboutDrawer from '../ResourceAboutDrawer';
import { ResourceItem } from '@store';

describe('ResourceAboutDrawer component', () => {
  const mockItem: ResourceItem = {
    Id: 'res-123',
    title: 'Chakra UI v3 Docs',
    subtitle: 'Official documentation for component styling library',
    link: 'https://chakra-ui.com',
    tags: ['styling', 'UI'],
    about_resource: 'Chakra UI provides accessible UI building blocks.',
  };

  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when closed or no item is provided', () => {
    renderWithProviders(
      <ResourceAboutDrawer
        isOpen={false}
        onOpenChange={mockOnOpenChange}
        item={null}
      />,
    );

    expect(screen.queryByText('Chakra UI v3 Docs')).not.toBeInTheDocument();
  });

  it('renders all information and rendered markdown when open', () => {
    renderWithProviders(
      <ResourceAboutDrawer
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        item={mockItem}
      />,
    );

    expect(screen.getByText('Chakra UI v3 Docs')).toBeInTheDocument();
    expect(screen.getByText('Official documentation for component styling library')).toBeInTheDocument();
    expect(screen.getByText('https://chakra-ui.com')).toBeInTheDocument();
    expect(screen.getByText('styling')).toBeInTheDocument();
    expect(screen.getByText('UI')).toBeInTheDocument();

    // Renders the about resource markdown content
    expect(screen.getByText('Chakra UI provides accessible UI building blocks.')).toBeInTheDocument();
  });
});
