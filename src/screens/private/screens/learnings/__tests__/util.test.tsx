import { screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../../testUtils/renderUtils';
import { filterLearnings, parseInlineMarkdown, renderMarkdown } from '../util';
import {
  serializeLearning,
  deserializeLearning,
} from '../../../../../services/googleDriveLearningsService';
import { LearningItem } from '@store';

describe('Learnings Utils', () => {
  describe('filterLearnings', () => {
    const mockLearnings: LearningItem[] = [
      {
        title: 'Learn React Hooks',
        subtitle: 'Deep dive into hooks',
        tags: ['React', 'Frontend'],
        content: 'Content here',
        createdAt: '2026-06-28',
        updatedAt: '2026-06-28',
      },
      {
        title: 'TypeScript Basics',
        subtitle: 'Learn types',
        tags: ['TS', 'Language'],
        content: 'Content here',
        createdAt: '2026-06-28',
        updatedAt: '2026-06-28',
      },
    ];

    it('returns all items when query is empty', () => {
      expect(filterLearnings(mockLearnings, '')).toEqual(mockLearnings);
    });

    it('filters by title', () => {
      const result = filterLearnings(mockLearnings, 'react');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Learn React Hooks');
    });

    it('filters by subtitle', () => {
      const result = filterLearnings(mockLearnings, 'types');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('TypeScript Basics');
    });

    it('filters by tag', () => {
      const result = filterLearnings(mockLearnings, 'Frontend');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Learn React Hooks');
    });
  });

  describe('serialize / deserialize learnings', () => {
    const item: LearningItem = {
      title: 'How to write markdown',
      subtitle: 'A simple guide',
      tags: ['guide', 'md'],
      content: '# Introduction\nThis is basic markdown.',
      createdAt: '2026-06-28T17:30:00Z',
      updatedAt: '2026-06-28T17:35:00Z',
    };

    it('should correctly serialize a learning item to frontmatter md', () => {
      const serialized = serializeLearning(item);
      expect(serialized).toContain('---');
      expect(serialized).toContain('title: How to write markdown');
      expect(serialized).toContain('subtitle: A simple guide');
      expect(serialized).toContain('tags: guide, md');
      expect(serialized).toContain('createdAt: 2026-06-28T17:30:00Z');
      expect(serialized).toContain('updatedAt: 2026-06-28T17:35:00Z');
      expect(serialized).toContain('# Introduction\nThis is basic markdown.');
    });

    it('should correctly deserialize a frontmatter md string to a learning item', () => {
      const md = `---
title: How to write markdown
subtitle: A simple guide
tags: guide, md
createdAt: 2026-06-28T17:30:00Z
updatedAt: 2026-06-28T17:35:00Z
---

# Introduction
This is basic markdown.`;

      const deserialized = deserializeLearning(md);
      expect(deserialized.title).toBe('How to write markdown');
      expect(deserialized.subtitle).toBe('A simple guide');
      expect(deserialized.tags).toEqual(['guide', 'md']);
      expect(deserialized.createdAt).toBe('2026-06-28T17:30:00Z');
      expect(deserialized.updatedAt).toBe('2026-06-28T17:35:00Z');
      expect(deserialized.content).toBe(
        '# Introduction\nThis is basic markdown.',
      );
    });
  });

  describe('markdown renderers', () => {
    it('parses bold inline markdown', () => {
      const nodes = parseInlineMarkdown('This is **bold** text');
      renderWithProviders(<>{nodes}</>);
      expect(screen.getByText('bold')).toBeInTheDocument();
      expect(screen.getByText('bold').tagName).toBe('STRONG');
    });

    it('parses inline code markdown', () => {
      const nodes = parseInlineMarkdown('This is `code` text');
      renderWithProviders(<>{nodes}</>);
      expect(screen.getByText('code')).toBeInTheDocument();
      expect(screen.getByText('code').tagName).toBe('CODE');
    });

    it('renders heading h1 block', () => {
      const nodes = renderMarkdown('# Header Title');
      renderWithProviders(<>{nodes}</>);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Header Title');
    });

    it('renders heading h2 block', () => {
      const nodes = renderMarkdown('## Section Title');
      renderWithProviders(<>{nodes}</>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Section Title');
    });

    it('renders bullet list items', () => {
      const nodes = renderMarkdown('- Bullet Item');
      renderWithProviders(<>{nodes}</>);
      expect(screen.getByRole('listitem')).toBeInTheDocument();
      expect(screen.getByRole('listitem')).toHaveTextContent('Bullet Item');
    });
  });
});
