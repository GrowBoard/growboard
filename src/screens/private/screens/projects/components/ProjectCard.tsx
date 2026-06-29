import { useTranslation } from 'react-i18next';
import {
  Box,
  Flex,
  Text,
  IconButton,
  HStack,
  Badge,
  Separator,
  Link,
} from '@chakra-ui/react';
import { LuTrash2, LuPencil, LuEye, LuExternalLink, LuUser } from 'react-icons/lu';
import { ProjectCardProps } from './types';

/**
 * ProjectCard renders an individual project as a premium glassmorphic card or list row.
 */
export const ProjectCard = ({
  item,
  projectIdx,
  onEdit,
  onDelete,
  onViewAbout,
  viewMode,
}: ProjectCardProps) => {
  const { t } = useTranslation();

  const statusColors: Record<string, string> = {
    pending: 'orange',
    ideaphase: 'purple',
    started: 'green',
    done: 'blue',
  };

  const statusBorderColors: Record<string, string> = {
    pending: 'orange.500',
    ideaphase: 'purple.500',
    started: 'green.500',
    done: 'blue.500',
  };
  const cardAccentColor = statusBorderColors[item.status] || 'gray.500';

  if (viewMode === 'list') {
    return (
      <Box
        bg="bg.card"
        backdropFilter="blur(16px)"
        border="1px solid"
        borderColor="border.subtle"
        borderLeft="4px solid"
        borderLeftColor={cardAccentColor}
        borderRadius="xl"
        p={4}
        shadow="sm"
        _hover={{
          borderColor: cardAccentColor,
          boxShadow: 'md',
          transform: 'translateX(2px)',
        }}
        transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        gap={4}
      >
        <Flex direction="column" gap={1.5} flex={1}>
          <HStack gap={2}>
            <Text fontSize="md" fontWeight="bold" color="text.primary">
              {item.title}
            </Text>
            <Badge colorPalette={statusColors[item.status] || 'gray'} size="xs">
              {item.status.toUpperCase()}
            </Badge>
          </HStack>
          {item.subtitle && (
            <Text fontSize="xs" color="text.secondary">
              {item.subtitle}
            </Text>
          )}
          {item.tags.length > 0 && (
            <HStack wrap="wrap" gap={1.5} mt={1}>
              {item.tags.map((tag) => (
                <Badge
                  key={tag}
                  bg="bg.active"
                  color="text.primary"
                  variant="outline"
                  borderColor="border.subtle"
                  borderRadius="md"
                  px={2}
                  py={0.5}
                  fontSize="10px"
                  fontWeight="medium"
                >
                  {tag}
                </Badge>
              ))}
            </HStack>
          )}
        </Flex>

        <HStack
          gap={3}
          align="center"
          width={{ base: '100%', md: 'auto' }}
          justify={{ base: 'space-between', md: 'flex-end' }}
        >
          <HStack gap={4}>
            {item.owner && (
              <HStack gap={1} color="text.muted" fontSize="xs">
                <LuUser size={12} />
                <Text>{item.owner}</Text>
              </HStack>
            )}
          </HStack>

          <HStack gap={2}>
            {item.link && (
              <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Project Link"
                title={item.link}
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="md"
                w="8"
                h="8"
                color="blue.400"
                _hover={{ bg: 'bg.active', color: 'blue.300' }}
                transition="all 0.2s"
              >
                <LuExternalLink size={16} />
              </Link>
            )}
            <IconButton
              aria-label="View project details"
              title={t('Projects.viewProject', 'View Project Details')}
              onClick={() => onViewAbout(item)}
              variant="ghost"
              size="sm"
              color="text.muted"
              _hover={{ bg: 'bg.active', color: 'blue.400' }}
            >
              <LuEye />
            </IconButton>
            <IconButton
              aria-label="Edit project"
              title={t('Projects.editProject', 'Edit Project')}
              onClick={() => onEdit(item)}
              variant="ghost"
              size="sm"
              color="text.muted"
              _hover={{ bg: 'bg.active', color: 'green.400' }}
            >
              <LuPencil />
            </IconButton>
            <IconButton
              aria-label="Delete project"
              title={t('Projects.deleteProject', 'Delete Project')}
              onClick={() => onDelete(item.Id)}
              variant="ghost"
              size="sm"
              color="text.muted"
              _hover={{
                bg: 'bg.active',
                color: 'red.500',
              }}
            >
              <LuTrash2 />
            </IconButton>
          </HStack>
        </HStack>
      </Box>
    );
  }

  // default card view
  return (
    <Box
      bg="bg.card"
      backdropFilter="blur(16px)"
      border="1px solid"
      borderColor="border.subtle"
      borderTop="4px solid"
      borderTopColor={cardAccentColor}
      borderRadius="xl"
      p={5}
      shadow="md"
      _hover={{
        borderColor: cardAccentColor,
        boxShadow: 'xl',
        transform: 'translateY(-3px)',
      }}
      transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minH="200px"
      gap={4}
    >
      <Box>
        <Flex justify="space-between" align="flex-start" gap={2}>
          <Text fontSize="lg" fontWeight="bold" color="text.primary" lineClamp={2}>
            {item.title}
          </Text>
          <HStack gap={1}>
            <Badge colorPalette={statusColors[item.status] || 'gray'} size="xs">
              {item.status.toUpperCase()}
            </Badge>
            <IconButton
              aria-label="View project details"
              title={t('Projects.viewProject', 'View Project Details')}
              onClick={() => onViewAbout(item)}
              variant="ghost"
              size="xs"
              color="text.muted"
              _hover={{ color: 'blue.400' }}
            >
              <LuEye size={16} />
            </IconButton>
          </HStack>
        </Flex>
        {item.subtitle && (
          <Text fontSize="xs" color="text.secondary" mt={1.5} lineClamp={2}>
            {item.subtitle}
          </Text>
        )}

        <HStack gap={3} mt={3} color="text.muted" fontSize="xs">
          {item.owner && (
            <HStack gap={1}>
              <LuUser size={12} />
              <Text>{item.owner}</Text>
            </HStack>
          )}
        </HStack>

        {item.tags.length > 0 && (
          <HStack wrap="wrap" gap={1.5} mt={3.5}>
            {item.tags.map((tag) => (
              <Badge
                key={tag}
                bg="bg.active"
                color="text.primary"
                variant="outline"
                borderColor="border.subtle"
                borderRadius="md"
                px={2}
                py={0.5}
                fontSize="10px"
                fontWeight="medium"
              >
                {tag}
              </Badge>
            ))}
          </HStack>
        )}
      </Box>

      <Box>
        <Separator borderColor="border.subtle" mb={3} />
        <Flex align="center" justify="space-between">
          <Box>
            {item.link && (
              <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Project Link"
                title={item.link}
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="md"
                w="8"
                h="8"
                color="blue.400"
                _hover={{ bg: 'bg.active', color: 'blue.300' }}
                transition="all 0.2s"
              >
                <LuExternalLink size={16} />
              </Link>
            )}
          </Box>
          <HStack gap={2}>
            <IconButton
              aria-label="Edit project"
              title={t('Projects.editProject', 'Edit Project')}
              onClick={() => onEdit(item)}
              variant="ghost"
              size="sm"
              color="text.muted"
              _hover={{
                bg: 'bg.active',
                color: 'green.450',
              }}
            >
              <LuPencil />
            </IconButton>
            <IconButton
              aria-label="Delete project"
              title={t('Projects.deleteProject', 'Delete Project')}
              onClick={() => onDelete(item.Id)}
              variant="ghost"
              size="sm"
              color="text.muted"
              _hover={{
                bg: 'bg.active',
                color: 'red.500',
              }}
            >
              <LuTrash2 />
            </IconButton>
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
};

export default ProjectCard;
