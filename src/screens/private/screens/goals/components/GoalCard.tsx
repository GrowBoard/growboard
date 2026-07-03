import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Flex,
  Text,
  IconButton,
  HStack,
  VStack,
  Badge,
  Button,
} from '@chakra-ui/react';
import {
  LuPencil,
  LuTrash2,
  LuChevronDown,
  LuChevronUp,
  LuCalendar,
  LuTrophy,
  LuGripVertical,
} from 'react-icons/lu';
import { GoalCardProps } from './types';

/**
 * GoalCard component renders an individual goal card,
 * adapting its layout based on viewMode ('card' or 'list').
 */
export const GoalCard = ({
  item,
  onEdit,
  onDelete,
  viewMode = 'card',
  isDraggable = false,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  isDragOver = false,
  isDragged = false,
}: GoalCardProps) => {
  const { t } = useTranslation();
  const [showFullDetails, setShowFullDetails] = useState(false);

  const hasLongDetails = item.details.length > 150;
  const displayDetails =
    hasLongDetails && !showFullDetails
      ? `${item.details.slice(0, 150)}...`
      : item.details;

  const handleEditClick = () => onEdit(item.title);
  const handleDeleteClick = () => onDelete(item.title);
  const toggleDetails = () => setShowFullDetails((prev) => !prev);

  const getStatusBadge = () => {
    switch (item.status) {
      case 'In-Progress':
        return (
          <Badge
            colorPalette="blue"
            variant="solid"
            size="sm"
            borderRadius="md"
          >
            {t('Goals.statusInProgress', 'In-Progress')}
          </Badge>
        );
      case 'Completed':
        return (
          <Badge
            colorPalette="green"
            variant="solid"
            size="sm"
            borderRadius="md"
          >
            {t('Goals.statusCompleted', 'Completed')}
          </Badge>
        );
      default:
        return (
          <Badge
            colorPalette="gray"
            variant="solid"
            size="sm"
            borderRadius="md"
          >
            {t('Goals.statusPending', 'Pending')}
          </Badge>
        );
    }
  };

  const getRankBadge = () => {
    if (item.ranking === undefined || item.ranking === null) return null;

    if (item.ranking === 1) {
      return (
        <Badge
          colorPalette="yellow"
          variant="outline"
          size="sm"
          borderRadius="md"
          border="1px solid"
          borderColor="yellow.500"
          px={2}
          py={0.5}
          display="flex"
          alignItems="center"
          gap={1}
          fontWeight="extrabold"
        >
          <LuTrophy style={{ color: 'var(--chakra-colors-yellow-500)' }} />
          {t('Goals.rankFirst', 'Rank #1')}
        </Badge>
      );
    }
    if (item.ranking === 2) {
      return (
        <Badge
          colorPalette="gray"
          variant="outline"
          size="sm"
          borderRadius="md"
          border="1px solid"
          borderColor="gray.400"
          px={2}
          py={0.5}
          display="flex"
          alignItems="center"
          gap={1}
          fontWeight="bold"
        >
          <LuTrophy style={{ color: 'var(--chakra-colors-gray-400)' }} />
          {t('Goals.rankSecond', 'Rank #2')}
        </Badge>
      );
    }
    if (item.ranking === 3) {
      return (
        <Badge
          colorPalette="orange"
          variant="outline"
          size="sm"
          borderRadius="md"
          border="1px solid"
          borderColor="orange.600"
          px={2}
          py={0.5}
          display="flex"
          alignItems="center"
          gap={1}
          fontWeight="bold"
        >
          <LuTrophy style={{ color: 'var(--chakra-colors-orange-600)' }} />
          {t('Goals.rankThird', 'Rank #3')}
        </Badge>
      );
    }
    return (
      <Badge
        colorPalette="cyan"
        variant="outline"
        size="sm"
        borderRadius="md"
        px={2}
        py={0.5}
      >
        {t('Goals.rankN', 'Rank #{{rank}}', { rank: item.ranking })}
      </Badge>
    );
  };

  if (viewMode === 'list') {
    return (
      <Flex
        w="full"
        bg="bg.panel"
        border="1px solid"
        borderColor={isDragOver ? 'blue.500' : 'border.subtle'}
        borderRadius="xl"
        p={4}
        shadow={isDragOver ? 'md' : 'sm'}
        opacity={isDragged ? 0.4 : 1}
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'flex-start', md: 'center' }}
        justify="space-between"
        gap={4}
        transition="all 0.25s"
        _hover={{ shadow: 'md', bg: 'bg.active' }}
        draggable={isDraggable}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
        cursor={isDraggable ? 'grab' : 'default'}
        _active={{ cursor: isDraggable ? 'grabbing' : 'default' }}
      >
        {isDraggable && (
          <Box
            color="text.muted"
            cursor="grab"
            mr={1}
            display={{ base: 'none', md: 'block' }}
          >
            <LuGripVertical size={20} />
          </Box>
        )}
        <VStack align="flex-start" gap={1} flex={1}>
          <HStack wrap="wrap" gap={2}>
            <Text fontSize="lg" fontWeight="bold" color="text.primary">
              {item.title}
            </Text>
            {getRankBadge()}
            {getStatusBadge()}
            {item.tags.map((tag) => (
              <Badge
                key={tag}
                colorPalette="cyan"
                variant="subtle"
                size="sm"
                borderRadius="md"
              >
                {tag}
              </Badge>
            ))}
          </HStack>
          {item.subtitle && (
            <Text fontSize="sm" color="text.secondary" fontWeight="medium">
              {item.subtitle}
            </Text>
          )}
          {item.details && (
            <Text fontSize="xs" color="text.muted" lineClamp={2}>
              {item.details}
            </Text>
          )}
        </VStack>

        {item.timeline && item.timeline.length > 0 && (
          <HStack gap={3} px={{ md: 4 }} py={{ base: 2, md: 0 }} wrap="wrap">
            {item.timeline.slice(0, 3).map((milestone, idx) => (
              <HStack
                key={idx}
                gap={1}
                bg="bg.cardHeader"
                px={2}
                py={1}
                borderRadius="md"
                border="1px solid"
                borderColor="border.subtle"
              >
                <LuCalendar
                  size={12}
                  style={{ color: 'var(--chakra-colors-text-muted)' }}
                />
                <Text
                  fontSize="xs"
                  color="text.secondary"
                  fontWeight="semibold"
                >
                  {milestone}
                </Text>
              </HStack>
            ))}
            {item.timeline.length > 3 && (
              <Text fontSize="xs" color="text.muted" fontWeight="semibold">
                +{item.timeline.length - 3} {t('Goals.more', 'more')}
              </Text>
            )}
          </HStack>
        )}

        <HStack
          gap={2}
          alignSelf={{ base: 'flex-end', md: 'center' }}
          flexShrink={0}
        >
          <IconButton
            aria-label="Edit Goal"
            title={t('Goals.edit', 'Edit Goal')}
            onClick={handleEditClick}
            variant="ghost"
            color="text.secondary"
            size="sm"
            _hover={{ bg: 'bg.cardHeader', color: 'blue.500' }}
          >
            <LuPencil />
          </IconButton>
          <IconButton
            aria-label="Delete Goal"
            title={t('Goals.delete', 'Delete Goal')}
            onClick={handleDeleteClick}
            variant="ghost"
            color="text.secondary"
            size="sm"
            _hover={{ bg: 'bg.cardHeader', color: 'red.500' }}
          >
            <LuTrash2 />
          </IconButton>
        </HStack>
      </Flex>
    );
  }

  return (
    <VStack
      bg="bg.panel"
      border="1px solid"
      borderColor={isDragOver ? 'blue.500' : 'border.subtle'}
      borderRadius="2xl"
      p={5}
      shadow={isDragOver ? 'md' : 'sm'}
      opacity={isDragged ? 0.4 : 1}
      align="stretch"
      gap={4}
      transition="all 0.3s"
      _hover={{ shadow: '2xl', transform: 'translateY(-2px)' }}
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      cursor={isDraggable ? 'grab' : 'default'}
      _active={{ cursor: isDraggable ? 'grabbing' : 'default' }}
    >
      {/* Card Header */}
      <Flex justify="space-between" align="flex-start" gap={2}>
        <HStack gap={2} align="center" flex={1}>
          {isDraggable && (
            <Box color="text.muted" cursor="grab">
              <LuGripVertical size={18} />
            </Box>
          )}
          <VStack align="flex-start" gap={1} flex={1}>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="text.primary"
              lineBreak="anywhere"
            >
              {item.title}
            </Text>
            {item.subtitle && (
              <Text
                fontSize="sm"
                color="text.secondary"
                fontWeight="medium"
                lineBreak="anywhere"
              >
                {item.subtitle}
              </Text>
            )}
          </VStack>
        </HStack>

        <HStack gap={1} flexShrink={0}>
          <IconButton
            aria-label="Edit Goal"
            title={t('Goals.edit', 'Edit Goal')}
            onClick={handleEditClick}
            variant="ghost"
            color="text.secondary"
            size="sm"
            _hover={{ bg: 'bg.cardHeader', color: 'blue.500' }}
          >
            <LuPencil />
          </IconButton>
          <IconButton
            aria-label="Delete Goal"
            title={t('Goals.delete', 'Delete Goal')}
            onClick={handleDeleteClick}
            variant="ghost"
            color="text.secondary"
            size="sm"
            _hover={{ bg: 'bg.cardHeader', color: 'red.500' }}
          >
            <LuTrash2 />
          </IconButton>
        </HStack>
      </Flex>

      {/* Badges Container (Rank, Status, Tags) */}
      <HStack wrap="wrap" gap={2}>
        {getRankBadge()}
        {getStatusBadge()}
        {item.tags.map((tag) => (
          <Badge
            key={tag}
            colorPalette="cyan"
            variant="subtle"
            size="sm"
            borderRadius="md"
          >
            {tag}
          </Badge>
        ))}
      </HStack>

      {/* Details */}
      {item.details && (
        <VStack align="stretch" gap={1}>
          <Text
            fontSize="sm"
            color="text.secondary"
            whiteSpace="pre-wrap"
            lineBreak="anywhere"
          >
            {displayDetails}
          </Text>
          {hasLongDetails && (
            <Button
              variant="plain"
              size="xs"
              alignSelf="flex-start"
              onClick={toggleDetails}
              gap={1}
              color="blue.500"
              fontWeight="bold"
              p={0}
              h="auto"
              _hover={{ color: 'blue.400' }}
            >
              {showFullDetails ? (
                <>
                  {t('Goals.showLess', 'Show Less')} <LuChevronUp />
                </>
              ) : (
                <>
                  {t('Goals.showMore', 'Show More')} <LuChevronDown />
                </>
              )}
            </Button>
          )}
        </VStack>
      )}

      {/* Timeline Section */}
      {item.timeline && item.timeline.length > 0 && (
        <VStack
          align="stretch"
          gap={2}
          pt={2}
          borderTop="1px solid"
          borderColor="border.subtle"
        >
          <Text
            fontSize="xs"
            fontWeight="bold"
            color="text.muted"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            {t('Goals.timeline', 'Timeline / Steps')}
          </Text>
          <VStack align="stretch" gap={3} pl={2} position="relative" py={1}>
            {/* Timeline Progress Line */}
            <Box
              position="absolute"
              left="4px"
              top="12px"
              bottom="12px"
              w="1px"
              bg="border.subtle"
            />
            {item.timeline.map((step, idx) => (
              <HStack key={idx} align="flex-start" gap={3} position="relative">
                {/* Bullet node */}
                <Box
                  w="9px"
                  h="9px"
                  borderRadius="full"
                  bg="cyan.500"
                  mt="5px"
                  border="2px solid"
                  borderColor="bg.panel"
                  boxShadow="0 0 0 1px var(--chakra-colors-border-subtle)"
                  zIndex={1}
                />
                <Text
                  fontSize="xs"
                  color="text.secondary"
                  fontWeight="medium"
                  flex={1}
                  lineBreak="anywhere"
                >
                  {step}
                </Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
      )}
    </VStack>
  );
};

export default GoalCard;
