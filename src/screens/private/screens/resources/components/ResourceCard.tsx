import { useTranslation } from 'react-i18next';
import {
  Box,
  Flex,
  Text,
  IconButton,
  HStack,
  Badge,
  Button,
  Separator,
  Link,
} from '@chakra-ui/react';
import { LuTrash2, LuExternalLink } from 'react-icons/lu';
import { ResourceCardProps } from '../types';

/**
 * ResourceCard renders an individual resource as a premium glassmorphic card or list row.
 */
export const ResourceCard = ({
  item,
  resourceIdx,
  onDelete,
  onViewAbout,
  viewMode,
}: ResourceCardProps) => {
  const { t } = useTranslation();

  const accentColors = [
    'blue.500',
    'teal.500',
    'purple.500',
    'emerald.500',
    'pink.500',
    'orange.500',
  ];
  const cardAccentColor = accentColors[resourceIdx % accentColors.length];

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
          <Text fontSize="md" fontWeight="bold" color="text.primary">
            {item.title}
          </Text>
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
          {item.about_resource && (
            <Button
              variant="outline"
              size="xs"
              fontSize="10px"
              borderColor="border.subtle"
              color="text.primary"
              borderRadius="lg"
              px={2.5}
              py={1}
              _hover={{ bg: 'bg.active' }}
              onClick={() => onViewAbout(item)}
            >
              {t('Resources.viewSupport', 'See resource content')}
            </Button>
          )}
          <HStack gap={2}>
            <Link
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Link"
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
            <IconButton
              aria-label="Delete resource"
              title={t('Resources.deleteResource', 'Delete Resource')}
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
      minH="190px"
      gap={4}
    >
      <Box>
        <Text fontSize="lg" fontWeight="bold" color="text.primary" lineClamp={2}>
          {item.title}
        </Text>
        {item.subtitle && (
          <Text fontSize="xs" color="text.secondary" mt={1.5} lineClamp={2}>
            {item.subtitle}
          </Text>
        )}
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
          <HStack gap={2}>
            <Link
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Link"
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
            <IconButton
              aria-label="Delete resource"
              title={t('Resources.deleteResource', 'Delete Resource')}
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

          {item.about_resource && (
            <Button
              variant="outline"
              size="xs"
              fontSize="10px"
              borderColor="border.subtle"
              color="text.primary"
              borderRadius="lg"
              px={2.5}
              py={1}
              _hover={{ bg: 'bg.active' }}
              onClick={() => onViewAbout(item)}
            >
              {t('Resources.viewSupport', 'See resource content')}
            </Button>
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default ResourceCard;
