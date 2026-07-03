import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../testUtils/renderUtils';
import ProjectCard from '../ProjectCard';

describe('ProjectCard component', () => {
  const mockProjectData = {
    image: 'https://example.com/project.png',
    title: 'GrowBoard',
    description: 'A productivity dashboard',
    icon: 'https://example.com/icon.png',
    isLive: true,
    projectLiveLink: 'growboard.example.com',
    githubLink: 'https://github.com/growboard',
    completed: 75,
    path: '/project/growboard',
  };

  it('renders title, description, live badge, image, icon and progress correctly', () => {
    renderWithProviders(<ProjectCard data={mockProjectData} />);

    // Check title (which is also a link)
    const titleLink = screen.getByRole('link', { name: /GrowBoard/i });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute('href', 'http://growboard.example.com');

    // Check live badge (isLive = true)
    expect(screen.getByText('Live')).toBeInTheDocument();

    // Check description
    expect(screen.getByText('A productivity dashboard')).toBeInTheDocument();

    // Check images
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2); // project image and icon
    expect(images[0]).toHaveAttribute('src', 'https://example.com/project.png');
    expect(images[1]).toHaveAttribute('src', 'https://example.com/icon.png');

    // Check progress
    expect(screen.getByText('75%')).toBeInTheDocument();

    // Check links/buttons
    const githubBtn = screen.getByRole('button', { name: /Project link/i });
    expect(githubBtn).toBeInTheDocument();

    const detailsBtn = screen.getByRole('button', {
      name: /ProjectCard\.projectDetailsLink/i,
    });
    expect(detailsBtn).toBeInTheDocument();
  });

  it('renders skeleton loaders when image and icon are not provided', () => {
    const dataWithoutAssets = {
      ...mockProjectData,
      image: '',
      icon: '',
      isLive: false,
    };

    renderWithProviders(<ProjectCard data={dataWithoutAssets} />);

    // project title shouldn't have green live badge
    expect(
      screen.queryByText('ProjectCard.liveStatus'),
    ).not.toBeInTheDocument();

    // Skeletons are rendered instead of Images
    // Skeletons have class name containing 'skeleton' or similar, but we can verify img tags are not rendered.
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
