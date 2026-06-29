import { useTranslation } from 'react-i18next';
import {
  Box,
  Drawer,
  IconButton,
  Heading,
  Text,
  HStack,
  Badge,
  Link,
  Separator,
} from '@chakra-ui/react';
import { LuX, LuExternalLink } from 'react-icons/lu';
import { ProjectAboutDrawerProps } from './types';
import { renderMarkdown } from '../util';

/**
 * ProjectAboutDrawer renders a slide-out drawer containing a read-only view
 * of the project details, description markdown, and remarks.
 */
export const ProjectAboutDrawer = ({
  isOpen,
  onOpenChange,
  item,
}: ProjectAboutDrawerProps) => {
  const { t } = useTranslation();

  if (!item) return null;

  const statusColors: Record<string, string> = {
    pending: 'orange',
    ideaphase: 'purple',
    started: 'green',
    done: 'blue',
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={onOpenChange} placement="end" size="lg">
      <Drawer.Backdrop backdropFilter="blur(3px)" />
      <Drawer.Positioner>
        <Drawer.Content
          bg="bg.panel"
          borderLeft="1px solid"
          borderColor="border.subtle"
          boxShadow="2xl"
          h="100vh"
        >
          <Drawer.CloseTrigger asChild>
            <IconButton
              aria-label="Close"
              variant="ghost"
              size="sm"
              position="absolute"
              top={3}
              right={4}
              color="text.secondary"
              _hover={{ bg: 'bg.active', color: 'text.primary' }}
            >
              <LuX />
            </IconButton>
          </Drawer.CloseTrigger>

          <Drawer.Header
            borderBottom="1px solid"
            borderColor="border.subtle"
            py={4}
            px={6}
          >
            <Drawer.Title fontSize="lg" fontWeight="bold" color="text.primary">
              {item.title}
            </Drawer.Title>
            {item.subtitle && (
              <Text fontSize="xs" color="text.secondary" mt={1}>
                {item.subtitle}
              </Text>
            )}
          </Drawer.Header>

          <Drawer.Body py={5} px={6} overflowY="auto" h="calc(100vh - 70px)">
            <Box display="flex" flexDirection="column" gap={5}>
              {/* Meta Stats Row */}
              <HStack gap={6} wrap="wrap">
                <Box>
                  <Heading size="xs" fontWeight="semibold" color="text.primary" mb={1}>
                    {t('Projects.ownerLabel', 'Owner')}
                  </Heading>
                  <Text fontSize="sm" color="text.secondary">
                    {item.owner || 'N/A'}
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" fontWeight="semibold" color="text.primary" mb={1}>
                    {t('Projects.statusLabel', 'Status')}
                  </Heading>
                  <Badge colorPalette={statusColors[item.status] || 'gray'} size="md">
                    {item.status.toUpperCase()}
                  </Badge>
                </Box>
              </HStack>

              {/* Link Row */}
              {item.link && (
                <Box>
                  <Heading size="xs" fontWeight="semibold" color="text.primary" mb={1.5}>
                    {t('Projects.linkLabel', 'Project Link')}
                  </Heading>
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="blue.400"
                    fontSize="sm"
                    display="inline-flex"
                    alignItems="center"
                    gap={1.5}
                    fontWeight="medium"
                    _hover={{ color: 'blue.300', textDecoration: 'underline' }}
                  >
                    {item.link}
                    <LuExternalLink size={14} />
                  </Link>
                </Box>
              )}

              {/* Tags Badges */}
              {item.tags.length > 0 && (
                <Box>
                  <Heading size="xs" fontWeight="semibold" color="text.primary" mb={1.5}>
                    {t('Projects.tagsLabel', 'Tags')}
                  </Heading>
                  <HStack wrap="wrap" gap={1.5}>
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        bg="bg.active"
                        color="text.primary"
                        variant="outline"
                        borderColor="border.subtle"
                        borderRadius="md"
                        px={2.5}
                        py={0.5}
                        fontSize="xs"
                        fontWeight="medium"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </HStack>
                </Box>
              )}

              <Separator borderColor="border.subtle" my={1} />

              {/* Description Markdown */}
              <Box>
                <Heading size="xs" fontWeight="semibold" color="text.primary" mb={2}>
                  {t('Projects.aboutLabel', 'About Project (Markdown)')}
                </Heading>
                <Box
                  p={4}
                  bg="bg.card"
                  border="1px solid"
                  borderColor="border.subtle"
                  borderRadius="lg"
                  minH="180px"
                >
                  {item.about_project ? (
                    renderMarkdown(item.about_project)
                  ) : (
                    <Text color="text.muted" fontSize="sm" fontStyle="italic">
                      No project description provided.
                    </Text>
                  )}
                </Box>
              </Box>

              {/* Remarks Section */}
              <Box>
                <Heading size="xs" fontWeight="semibold" color="text.primary" mb={2}>
                  {t('Projects.remarkLabel', 'Remarks')}
                </Heading>
                <Box
                  p={4}
                  bg="bg.card"
                  border="1px solid"
                  borderColor="border.subtle"
                  borderRadius="lg"
                  minH="100px"
                  whiteSpace="pre-wrap"
                >
                  {item.remark ? (
                    <Text fontSize="sm" color="text.primary">
                      {item.remark}
                    </Text>
                  ) : (
                    <Text color="text.muted" fontSize="sm" fontStyle="italic">
                      No remarks provided.
                    </Text>
                  )}
                </Box>
              </Box>
            </Box>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default ProjectAboutDrawer;
