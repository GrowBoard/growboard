import React from 'react';
import { Heading, Text, List, Code, Box } from '@chakra-ui/react';
import { LearningItem } from '@store';

/**
 * Filters the list of learnings based on the search query.
 * Matches against title, subtitle, or tags.
 *
 * @param learnings The list of learnings.
 * @param query The search query.
 * @returns The filtered list of learnings.
 */
export const filterLearnings = (
  learnings: LearningItem[],
  query: string,
): LearningItem[] => {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return learnings;

  return learnings.filter((item) => {
    const matchTitle = item.title.toLowerCase().includes(cleanQuery);
    const matchSubtitle = item.subtitle.toLowerCase().includes(cleanQuery);
    const matchTags = item.tags.some((tag) =>
      tag.toLowerCase().includes(cleanQuery),
    );
    return matchTitle || matchSubtitle || matchTags;
  });
};

/**
 * Inline markdown parser to handle **bold** and `code` tags.
 *
 * @param text Inline text string.
 * @returns Array of parsed React elements or text.
 */
export const parseInlineMarkdown = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining) {
    const boldIndex = remaining.indexOf('**');
    const codeIndex = remaining.indexOf('`');

    if (boldIndex === -1 && codeIndex === -1) {
      parts.push(remaining);
      break;
    }

    if (boldIndex !== -1 && (codeIndex === -1 || boldIndex < codeIndex)) {
      if (boldIndex > 0) {
        parts.push(remaining.substring(0, boldIndex));
      }
      const rest = remaining.substring(boldIndex + 2);
      const nextBold = rest.indexOf('**');
      if (nextBold !== -1) {
        parts.push(
          <strong key={`bold-${keyIndex++}`} style={{ fontWeight: 'bold' }}>
            {rest.substring(0, nextBold)}
          </strong>
        );
        remaining = rest.substring(nextBold + 2);
      } else {
        parts.push('**' + rest);
        remaining = '';
      }
    } else {
      if (codeIndex > 0) {
        parts.push(remaining.substring(0, codeIndex));
      }
      const rest = remaining.substring(codeIndex + 1);
      const nextCode = rest.indexOf('`');
      if (nextCode !== -1) {
        parts.push(
          <Code
            key={`code-${keyIndex++}`}
            px={1}
            bg="bg.panel"
            color="text.primary"
            borderRadius="sm"
            fontFamily="mono"
            fontSize="xs"
          >
            {rest.substring(0, nextCode)}
          </Code>
        );
        remaining = rest.substring(nextCode + 1);
      } else {
        parts.push('`' + rest);
        remaining = '';
      }
    }
  }

  return parts;
};

/**
 * Custom lightweight Markdown block parser and renderer.
 * Converts markdown lines into responsive React components.
 *
 * @param md The raw markdown content body.
 * @returns A list of React Nodes representing the rendered markdown.
 */
export const renderMarkdown = (md: string): React.ReactNode[] => {
  if (!md) return [];

  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <Box
            key={`codeblock-${i}`}
            p={4}
            bg="bg.panel"
            borderRadius="md"
            border="1px solid"
            borderColor="border.subtle"
            fontFamily="mono"
            fontSize="sm"
            whiteSpace="pre-wrap"
            color="text.primary"
            my={3}
          >
            {codeContent.join('\n')}
          </Box>
        );
        codeContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // Headers
    if (line.startsWith('# ')) {
      elements.push(
        <Heading
          key={`h1-${i}`}
          as="h1"
          size="lg"
          color="text.primary"
          mt={5}
          mb={3}
          fontWeight="bold"
          borderBottom="1px solid"
          borderColor="border.subtle"
          pb={1}
        >
          {parseInlineMarkdown(line.substring(2))}
        </Heading>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <Heading
          key={`h2-${i}`}
          as="h2"
          size="md"
          color="text.primary"
          mt={4}
          mb={2}
          fontWeight="semibold"
        >
          {parseInlineMarkdown(line.substring(3))}
        </Heading>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <Heading
          key={`h3-${i}`}
          as="h3"
          size="sm"
          color="text.primary"
          mt={3}
          mb={2}
          fontWeight="semibold"
        >
          {parseInlineMarkdown(line.substring(4))}
        </Heading>
      );
    }
    // Bullet items
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <List.Root key={`ul-${i}`} pl={5} my={2} as="ul">
          <List.Item color="text.secondary" listStyleType="disc">
            {parseInlineMarkdown(line.substring(2))}
          </List.Item>
        </List.Root>
      );
    }
    // Horizontal rule
    else if (line.trim() === '---' || line.trim() === '***') {
      elements.push(
        <Box
          key={`hr-${i}`}
          borderBottom="1px solid"
          borderColor="border.subtle"
          my={4}
        />
      );
    }
    // Normal paragraph or empty break
    else {
      if (line.trim() === '') {
        elements.push(<Box key={`br-${i}`} height="8px" />);
      } else {
        elements.push(
          <Text
            key={`p-${i}`}
            color="text.secondary"
            mb={2}
            lineHeight="tall"
            fontSize="sm"
          >
            {parseInlineMarkdown(line)}
          </Text>
        );
      }
    }
  }

  return elements;
};
