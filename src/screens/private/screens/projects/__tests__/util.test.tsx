import { filterProjects, parseInlineMarkdown, renderMarkdown } from '../util';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../testUtils/renderUtils';

const makeProject = (overrides = {}) => ({
  Id: 'p1',
  title: 'React Basics',
  subtitle: 'Front-end',
  link: 'https://example.com',
  tags: ['react', 'js'],
  about_project: 'A React project',
  remark: 'Good',
  owner: 'Alice',
  status: 'pending' as const,
  ...overrides,
});

describe('filterProjects', () => {
  const projects = [
    makeProject({ title: 'React Basics', owner: 'Alice', tags: ['react'] }),
    makeProject({ Id: 'p2', title: 'Node API', owner: 'Bob', tags: ['node'], status: 'done' }),
  ];

  it('returns all projects when query is empty', () => {
    expect(filterProjects(projects, '')).toHaveLength(2);
  });

  it('filters by title (case-insensitive)', () => {
    const result = filterProjects(projects, 'react');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('React Basics');
  });

  it('filters by owner', () => {
    const result = filterProjects(projects, 'bob');
    expect(result).toHaveLength(1);
    expect(result[0].owner).toBe('Bob');
  });

  it('filters by status', () => {
    const result = filterProjects(projects, 'done');
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('done');
  });

  it('filters by tags', () => {
    const result = filterProjects(projects, 'node');
    expect(result).toHaveLength(1);
    expect(result[0].tags).toContain('node');
  });

  it('returns empty array when no match', () => {
    expect(filterProjects(projects, 'zzznomatch')).toHaveLength(0);
  });
});

describe('parseInlineMarkdown', () => {
  it('returns plain text as-is', () => {
    const result = parseInlineMarkdown('Hello world');
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('Hello world');
  });

  it('wraps **bold** text in <strong>', () => {
    const result = parseInlineMarkdown('Say **hello** now');
    const boldEl = result.find((r) => typeof r === 'object');
    expect(boldEl).toBeDefined();
    const { container } = render(<>{result}</>);
    expect(container.querySelector('strong')).toHaveTextContent('hello');
  });

  it('wraps `code` in Code element', () => {
    const result = parseInlineMarkdown('Run `npm install` now');
    const { container } = renderWithProviders(<>{result}</>);
    expect(container.textContent).toContain('npm install');
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

describe('renderMarkdown', () => {
  it('returns empty array for empty string', () => {
    expect(renderMarkdown('')).toHaveLength(0);
  });

  it('renders h1 heading for # prefix', () => {
    const nodes = renderMarkdown('# Heading One');
    const { container } = renderWithProviders(<>{nodes}</>);
    expect(container.querySelector('h1')?.textContent).toContain('Heading One');
  });

  it('renders h2 heading for ## prefix', () => {
    const nodes = renderMarkdown('## Heading Two');
    const { container } = renderWithProviders(<>{nodes}</>);
    expect(container.querySelector('h2')?.textContent).toContain('Heading Two');
  });

  it('renders h3 heading for ### prefix', () => {
    const nodes = renderMarkdown('### Heading Three');
    const { container } = renderWithProviders(<>{nodes}</>);
    expect(container.querySelector('h3')?.textContent).toContain('Heading Three');
  });

  it('renders bullet list item for - prefix', () => {
    const nodes = renderMarkdown('- Item one');
    const { container } = renderWithProviders(<>{nodes}</>);
    expect(container.textContent).toContain('Item one');
  });

  it('renders bullet list item for * prefix', () => {
    const nodes = renderMarkdown('* Star item');
    const { container } = renderWithProviders(<>{nodes}</>);
    expect(container.textContent).toContain('Star item');
  });

  it('renders code block between ``` markers', () => {
    const nodes = renderMarkdown('```\nconst x = 1;\n```');
    const { container } = renderWithProviders(<>{nodes}</>);
    expect(container.textContent).toContain('const x = 1;');
  });

  it('renders paragraph for regular lines', () => {
    const nodes = renderMarkdown('Normal text here');
    const { container } = renderWithProviders(<>{nodes}</>);
    expect(container.textContent).toContain('Normal text here');
  });
});
