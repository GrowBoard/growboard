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
import { ResourceAboutDrawerProps } from '../types';
import { renderMarkdown } from '../util';

/**
 * ResourceAboutDrawer renders a slide-out drawer containing a read-only view
 * of the resource about_resource markdown contents and details.
 */
export const ResourceAboutDrawer = ({
  isOpen,
  onOpenChange,
  item,
}: ResourceAboutDrawerProps) => {
  const { t } = useTranslation();

  if (!item) return null;

  return (
    <Drawer.Root open={isOpen} onOpenChange={onOpenChange} placement="end" size="md">
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
            <Box display="flex" flexDirection="column" gap={4}>
              {/* Link Row */}
              <Box>
                <Heading size="xs" fontWeight="semibold" color="text.primary" mb={1.5}>
                  {t('Resources.linkLabel', 'Resource Link (URL)')}
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

              {/* Tags Badges */}
              {item.tags.length > 0 && (
                <Box>
                  <Heading size="xs" fontWeight="semibold" color="text.primary" mb={1.5}>
                    {t('Resources.tagsLabel', 'Tags')}
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

              {/* Markdown Content */}
              <Box>
                <Heading size="xs" fontWeight="semibold" color="text.primary" mb={2}>
                  {t('Resources.contentLabel', 'About Resource (Markdown)')}
                </Heading>
                <Box
                  p={4}
                  bg="bg.card"
                  border="1px solid"
                  borderColor="border.subtle"
                  borderRadius="lg"
                  minH="200px"
                >
                  {item.about_resource ? (
                    renderMarkdown(item.about_resource)
                  ) : (
                    <Text color="text.muted" fontSize="sm" fontStyle="italic">
                      No description provided.
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

export default ResourceAboutDrawer;
