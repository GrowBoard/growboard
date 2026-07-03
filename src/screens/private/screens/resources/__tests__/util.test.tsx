import { filterResources, parseInlineMarkdown, renderMarkdown } from '../util';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../testUtils/renderUtils';

const makeResource = (overrides = {}) => ({
  Id: 'r1',
  title: 'React Docs',
  subtitle: 'Official docs',
  link: 'https://react.dev',
  tags: ['react', 'frontend'],
  about_resource: 'Official React documentation',
  ...overrides,
});

describe('filterResources', () => {
  const resources = [
    makeResource({ title: 'React Docs', tags: ['react'] }),
    makeResource({ Id: 'r2', title: 'Node Guide', subtitle: 'Backend', link: 'https://node.js.org', tags: ['node'] }),
  ];

  it('returns all resources when query is empty', () => {
    expect(filterResources(resources, '')).toHaveLength(2);
  });

  it('filters by title (case-insensitive)', () => {
    const result = filterResources(resources, 'react');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('React Docs');
  });

  it('filters by subtitle', () => {
    const result = filterResources(resources, 'backend');
    expect(result).toHaveLength(1);
    expect(result[0].subtitle).toBe('Backend');
  });

  it('filters by link', () => {
    const result = filterResources(resources, 'node.js');
    expect(result).toHaveLength(1);
    expect(result[0].link).toContain('node');
  });

  it('filters by tags', () => {
    const result = filterResources(resources, 'react');
    expect(result).toHaveLength(1);
    expect(result[0].tags).toContain('react');
  });

  it('returns empty array when no match', () => {
    expect(filterResources(resources, 'zzznomatch')).toHaveLength(0);
  });
});

describe('parseInlineMarkdown (resources)', () => {
  it('returns plain text as-is', () => {
    const result = parseInlineMarkdown('Hello world');
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('Hello world');
  });

  it('wraps **bold** text in <strong>', () => {
    const result = parseInlineMarkdown('This is **bold** text');
    const { container } = render(<>{result}</>);
    expect(container.querySelector('strong')?.textContent).toBe('bold');
  });

  it('wraps `code` in Code element', () => {
    const result = parseInlineMarkdown('Run `yarn install` now');
    const { container } = renderWithProviders(<>{result}</>);
    expect(container.textContent).toContain('yarn install');
  });

  it('handles unclosed bold marker gracefully', () => {
    const result = parseInlineMarkdown('**unclosed');
    expect(result.join('')).toContain('unclosed');
  });

  it('handles unclosed code marker gracefully', () => {
    const result = parseInlineMarkdown('`unclosed');
    expect(result.join('')).toContain('unclosed');
  });
});

describe('renderMarkdown (resources)', () => {
  it('returns empty array for empty string', () => {
    expect(renderMarkdown('')).toHaveLength(0);
  });

  it('renders h1 heading', () => {
    const nodes = renderMarkdown('# Main Title');
    const { container } = renderWithProviders(<>{nodes}</>);
    expect(container.querySelector('h1')?.textContent).toContain('Main Title');
  });

  it('renders h2 heading', () => {
    const nodes = renderMarkdown('## Sub Title');
    const { container } = renderWithProviders(<>{nodes}</>);
    expect(container.querySelector('h2')?.textContent).toContain('Sub Title');
  });

  it('renders bullet list items', () => {
    const nodes = renderMarkdown('- First item');
    const { container } = renderWithProviders(<>{nodes}</>);
    expect(container.textContent).toContain('First item');
  });

  it('renders code block between ``` markers', () => {
    const nodes = renderMarkdown('```\nconst y = 2;\n```');
    const { container } = renderWithProviders(<>{nodes}</>);
    expect(container.textContent).toContain('const y = 2;');
  });

  it('renders paragraph for regular text', () => {
    const nodes = renderMarkdown('A regular paragraph');
    const { container } = renderWithProviders(<>{nodes}</>);
    expect(container.textContent).toContain('A regular paragraph');
  });
});
