import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

import { renderWithProviders } from '../../../../../../testUtils/renderUtils';
import { ProjectAboutDrawer } from '../ProjectAboutDrawer';

// Mock @provider to break circular dependency during test import phase
jest.mock('@provider', () => ({
  ThemeProvider: ({ children }: any) => (
    <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
  ),
}));

describe('ProjectAboutDrawer component', () => {
  const mockOnOpenChange = jest.fn();

  const defaultProps = {
    isOpen: true,
    onOpenChange: mockOnOpenChange,
    item: undefined,
  };

  it('returns null if item is not provided', () => {
    const { container } = renderWithProviders(
      <ProjectAboutDrawer {...defaultProps} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders all details for a complete project item', () => {
    const item = {
      Id: 'p-1',
      title: 'Obsidian Project',
      subtitle: 'Obsidian Theme Subtitle',
      owner: 'Amit Raikwar',
      status: 'started' as const,
      link: 'https://obsidian.md',
      tags: ['Markdown', 'Editor'],
      about_project: 'Markdown text project details',
      remark: 'Extra notes here',
    };

    renderWithProviders(<ProjectAboutDrawer {...defaultProps} item={item} />);

    expect(screen.getByText('Obsidian Project')).toBeInTheDocument();
    expect(screen.getByText('Obsidian Theme Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Amit Raikwar')).toBeInTheDocument();
    expect(screen.getByText('STARTED')).toBeInTheDocument();
    expect(screen.getByText('https://obsidian.md')).toBeInTheDocument();
    expect(screen.getByText('Markdown')).toBeInTheDocument();
    expect(screen.getByText('Editor')).toBeInTheDocument();
    expect(
      screen.getByText('Markdown text project details'),
    ).toBeInTheDocument();
    expect(screen.getByText('Extra notes here')).toBeInTheDocument();
  });

  it('renders fallback text for missing optional fields', () => {
    const item = {
      Id: 'p-2',
      title: 'Minimal Project',
      status: 'pending' as const,
      tags: [],
    };

    renderWithProviders(<ProjectAboutDrawer {...defaultProps} item={item} />);

    expect(screen.getByText('Minimal Project')).toBeInTheDocument();
    expect(screen.getByText('N/A')).toBeInTheDocument(); // Owner fallback
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    expect(
      screen.getByText('No project description provided.'),
    ).toBeInTheDocument();
    expect(screen.getByText('No remarks provided.')).toBeInTheDocument();
  });
});
