import { getProjectCardData } from '../utils';

describe('getProjectCardData utility', () => {
  it('correctly maps raw project object to ProjectCardData structure', () => {
    const rawProject = {
      projectName: 'Test App',
      projectDesc: 'A nice app',
      projectIcon: 'icon.png',
      images: ['image1.png', 'image2.png'],
      projectId: 'app-1',
      projectLink: 'test.example.com',
      githubLink: 'https://github.com/test',
      isLive: true,
      projectCompleted: 90,
    };

    const mapped = getProjectCardData(rawProject);

    expect(mapped).toEqual({
      title: 'Test App',
      description: 'A nice app',
      icon: 'icon.png',
      image: 'image1.png',
      path: 'preview/app-1',
      projectLiveLink: 'test.example.com',
      githubLink: 'https://github.com/test',
      isLive: true,
      completed: 90,
    });
  });

  it('handles project with no images array or empty images array', () => {
    const rawProject = {
      projectName: 'Test App',
      projectDesc: 'A nice app',
      projectIcon: 'icon.png',
      images: [],
      projectId: 'app-1',
      projectLink: 'test.example.com',
      githubLink: 'https://github.com/test',
      isLive: true,
      projectCompleted: 90,
    };

    const mapped = getProjectCardData(rawProject);
    expect(mapped.image).toBe('');

    const rawProjectNoImages = {
      projectName: 'Test App',
      projectDesc: 'A nice app',
      projectIcon: 'icon.png',
      projectId: 'app-1',
      projectLink: 'test.example.com',
      githubLink: 'https://github.com/test',
      isLive: true,
      projectCompleted: 90,
    };

    const mapped2 = getProjectCardData(rawProjectNoImages);
    expect(mapped2.image).toBe('');
  });
});
