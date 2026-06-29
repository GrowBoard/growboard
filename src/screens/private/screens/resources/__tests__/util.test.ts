import { filterResources, renderMarkdown } from '../util';
import { ResourceItem } from '@store';

describe('Resources utils', () => {
  describe('filterResources', () => {
    const mockResources: ResourceItem[] = [
      {
        Id: '1',
        title: 'React Docs',
        subtitle: 'Official documentation',
        link: 'https://react.dev',
        tags: ['React', 'Frontend'],
        about_resource: 'Learn React concepts.',
      },
      {
        Id: '2',
        title: 'Chakra UI',
        subtitle: 'Styling component library',
        link: 'https://chakra-ui.com',
        tags: ['CSS', 'UI', 'Design'],
        about_resource: 'Responsive elements.',
      },
    ];

    it('returns all items when query is empty', () => {
      expect(filterResources(mockResources, '')).toEqual(mockResources);
    });

    it('filters by title', () => {
      const result = filterResources(mockResources, 'React');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('React Docs');
    });

    it('filters by subtitle', () => {
      const result = filterResources(mockResources, 'Styling');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Chakra UI');
    });

    it('filters by link', () => {
      const result = filterResources(mockResources, 'react.dev');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('React Docs');
    });

    it('filters by tags', () => {
      const result = filterResources(mockResources, 'Design');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Chakra UI');
    });
  });

  describe('renderMarkdown', () => {
    it('returns empty array when content is empty', () => {
      expect(renderMarkdown('')).toEqual([]);
    });

    it('parses inline bold and code tags', () => {
      const rendered = renderMarkdown('**bold** and `code` text');
      expect(rendered).toHaveLength(1);
    });
  });
});
