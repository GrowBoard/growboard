import {
  Badge,
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LuPencil, LuTrash2, LuBookOpen } from 'react-icons/lu';
import { LearningCardProps } from '../types';

/**
 * LearningCard renders a glassmorphic summary tile representing a single learning.
 * Includes interactive edit, delete, and detail preview action buttons.
 */
export const LearningCard = ({
  item,
  onEdit,
  onDelete,
  onPreview,
}: LearningCardProps) => {
  return (
    <Box
      p={5}
      bg="bg.card"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="xl"
      shadow="md"
      backdropFilter="blur(8px)"
      transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
      position="relative"
      overflow="hidden"
      _hover={{
        transform: 'translateY(-2px)',
        borderColor: 'border.focus',
        boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.4)',
        bg: 'bg.panel',
      }}
    >
      {/* Decorative glass background accent */}
      <Box
        position="absolute"
        top="-50%"
        right="-50%"
        w="200px"
        h="200px"
        bg="radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)"
        pointerEvents="none"
      />

      <VStack align="stretch" gap={3} height="full" justify="space-between">
        <VStack align="stretch" gap={2}>
          {/* Header Title */}
          <Flex justify="space-between" align="flex-start" gap={3}>
            <Text
              fontSize="md"
              fontWeight="bold"
              color="text.primary"
              lineBreak="anywhere"
              lineClamp={2}
            >
              {item.title}
            </Text>
            <HStack gap={1} flexShrink={0}>
              <IconButton
                aria-label="Preview Learning"
                size="xs"
                variant="ghost"
                color="text.secondary"
                _hover={{ bg: 'bg.active', color: 'blue.400' }}
                onClick={() => onPreview(item)}
              >
                <LuBookOpen size={14} />
              </IconButton>
              <IconButton
                aria-label="Edit Learning"
                size="xs"
                variant="ghost"
                color="text.secondary"
                _hover={{ bg: 'bg.active', color: 'yellow.400' }}
                onClick={() => onEdit(item)}
              >
                <LuPencil size={14} />
              </IconButton>
              <IconButton
                aria-label="Delete Learning"
                size="xs"
                variant="ghost"
                color="text.secondary"
                _hover={{ bg: 'bg.active', color: 'red.400' }}
                onClick={() => onDelete(item.title)}
              >
                <LuTrash2 size={14} />
              </IconButton>
            </HStack>
          </Flex>

          {/* Subtitle / Short description */}
          {item.subtitle && (
            <Text
              fontSize="xs"
              color="text.muted"
              lineHeight="relaxed"
              lineClamp={3}
            >
              {item.subtitle}
            </Text>
          )}
        </VStack>

        {/* Footer Tags */}
        {item.tags.length > 0 && (
          <HStack wrap="wrap" gap={1.5} pt={2}>
            {item.tags.map((tag) => (
              <Badge
                key={tag}
                variant="subtle"
                bg="bg.active"
                color="text.secondary"
                px={2}
                py={0.5}
                borderRadius="md"
                fontSize="10px"
                fontWeight="medium"
                border="1px solid"
                borderColor="border.subtle"
              >
                {tag}
              </Badge>
            ))}
          </HStack>
        )}
      </VStack>
    </Box>
  );
};

export default LearningCard;
