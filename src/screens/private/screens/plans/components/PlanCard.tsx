import { useTranslation } from 'react-i18next';
import {
  Box,
  Flex,
  Text,
  IconButton,
  HStack,
  VStack,
  Badge,
} from '@chakra-ui/react';
import { LuTrash2, LuPencil, LuEye, LuCalendar, LuClock } from 'react-icons/lu';
import { PlanCardProps } from './types';

/**
 * PlanCard renders an individual plan item as a premium glassmorphic card or list row.
 */
export const PlanCard = ({
  item,
  planIdx,
  onEdit,
  onDelete,
  onViewAbout,
  viewMode,
}: PlanCardProps) => {
  const { t } = useTranslation();

  const accentColors = [
    'blue.500',
    'teal.500',
    'purple.500',
    'emerald.500',
    'pink.500',
    'orange.500',
  ];
  const cardAccentColor = accentColors[planIdx % accentColors.length];

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
        p={4.5}
        shadow="sm"
        _hover={{
          borderColor: cardAccentColor,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
        transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems={{ base: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        gap={4}
      >
        <Flex direction="column" gap={0.5} flex={1} w="100%">
          <HStack justify="space-between" align="center" w="100%">
            <Text fontSize="md" fontWeight="bold" color="text.primary">
              {item.title}
            </Text>
            {(item.date || item.time) && (
              <HStack
                bg="bg.panel"
                py={0.5}
                px={2.5}
                borderRadius="full"
                border="1px solid"
                borderColor="border.subtle"
              >
                <LuCalendar
                  size={12}
                  style={{ color: 'var(--chakra-colors-blue-400)' }}
                />
                <Text
                  fontSize="11px"
                  fontWeight="medium"
                  color="text.secondary"
                >
                  {item.date || 'No Date'}
                </Text>
                {item.time && (
                  <>
                    <Box w="3px" h="3px" borderRadius="full" bg="text.muted" />
                    <LuClock
                      size={12}
                      style={{ color: 'var(--chakra-colors-teal-400)' }}
                    />
                    <Text
                      fontSize="11px"
                      fontWeight="medium"
                      color="text.secondary"
                    >
                      {item.time}
                    </Text>
                  </>
                )}
              </HStack>
            )}
          </HStack>

          <HStack justifyContent="space-between">
            <VStack gap={2} align="start" flexShrink={0}>
              {item.subtitle && (
                <Text fontSize="xs" fontWeight="medium" color="text.secondary">
                  {item.subtitle}
                </Text>
              )}

              {item.about_plan && (
                <Text fontSize="xs" color="text.muted" lineClamp={2} mt={0.5}>
                  {item.about_plan}
                </Text>
              )}

              {item.tags.length > 0 && (
                <HStack wrap="wrap" gap={1.5} mt={1.5}>
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
            </VStack>
            <HStack
              gap={1}
              align="center"
              width={{ base: '100%', md: 'auto' }}
              justify={{ base: 'space-between', md: 'flex-end' }}
              flexShrink={0}
            >
              <IconButton
                aria-label="View plan details"
                title={t('Plans.viewPlan', 'View Plan Details')}
                onClick={() => onViewAbout(item)}
                variant="outline"
                size="sm"
                borderRadius="xl"
                border="1px solid var(--chakra-colors-border-subtle)"
                _hover={{ bg: 'bg.active', color: 'blue.400' }}
              >
                <LuEye />
              </IconButton>
              <IconButton
                aria-label="Edit plan"
                title={t('Plans.editPlan', 'Edit Plan')}
                onClick={() => onEdit(item)}
                variant="ghost"
                size="sm"
                border="1px solid var(--chakra-colors-border-subtle)"
                borderRadius="lg"
                _hover={{ bg: 'bg.active', color: 'green.400' }}
              >
                <LuPencil />
              </IconButton>
              <IconButton
                aria-label="Delete plan"
                title={t('Plans.deletePlan', 'Delete Plan')}
                onClick={() => onDelete(item.Id)}
                variant="ghost"
                size="sm"
                borderRadius="lg"
                border="1px solid var(--chakra-colors-border-subtle)"
                _hover={{
                  bg: 'bg.active',
                  color: 'red.500',
                }}
              >
                <LuTrash2 />
              </IconButton>
            </HStack>
          </HStack>
        </Flex>
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
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
        transform: 'translateY(-2px)',
      }}
      transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minH="200px"
      gap={1}
    >
      <Flex justify="space-between" align="flex-start" gap={2}>
        <VStack align="flex-start" gap={1} flex={1}>
          <Text
            fontSize="md"
            fontWeight="bold"
            color="text.primary"
            lineClamp={2}
            lineHeight="short"
          >
            {item.title}
          </Text>
          {item.subtitle && (
            <Text fontSize="11px" color="text.secondary" lineClamp={1}>
              {item.subtitle}
            </Text>
          )}
        </VStack>

        {(item.date || item.time) && (
          <HStack
            gap={1}
            bg="bg.panel"
            py={0.5}
            px={2}
            borderRadius="md"
            border="1px solid"
            borderColor="border.subtle"
            flexShrink={0}
          >
            <LuCalendar
              size={11}
              style={{ color: 'var(--chakra-colors-blue-400)' }}
            />
            <Text fontSize="10px" fontWeight="medium" color="text.secondary">
              {item.date || 'No Date'}
            </Text>
          </HStack>
        )}
      </Flex>

      {item.about_plan ? (
        <Text
          fontSize="xs"
          color="text.muted"
          mt={3.5}
          lineClamp={2}
          lineHeight="relaxed"
        >
          {item.about_plan}
        </Text>
      ) : (
        <Box h="38px" />
      )}

      {item.tags.length > 0 && (
        <HStack wrap="wrap" mt={1}>
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

      <Box>
        <Flex align="center" justify="space-between">
          {item.time ? (
            <HStack gap={1} color="text.muted">
              <LuClock
                size={12}
                style={{ color: 'var(--chakra-colors-teal-400)' }}
              />
              <Text fontSize="12px" fontWeight="medium">
                {item.time}
              </Text>
            </HStack>
          ) : (
            <Box />
          )}

          <HStack
            gap={1}
            align="center"
            width={{ base: '100%', md: 'auto' }}
            justify={{ base: 'space-between', md: 'flex-end' }}
            flexShrink={0}
          >
            <IconButton
              aria-label="View plan details"
              title={t('Plans.viewPlan', 'View Plan Details')}
              onClick={() => onViewAbout(item)}
              variant="outline"
              size="sm"
              borderRadius="xl"
              border="1px solid var(--chakra-colors-border-subtle)"
              _hover={{ bg: 'bg.active', color: 'blue.400' }}
            >
              <LuEye />
            </IconButton>
            <IconButton
              aria-label="Edit plan"
              title={t('Plans.editPlan', 'Edit Plan')}
              onClick={() => onEdit(item)}
              variant="ghost"
              size="sm"
              border="1px solid var(--chakra-colors-border-subtle)"
              borderRadius="lg"
              _hover={{ bg: 'bg.active', color: 'green.400' }}
            >
              <LuPencil />
            </IconButton>
            <IconButton
              aria-label="Delete plan"
              title={t('Plans.deletePlan', 'Delete Plan')}
              onClick={() => onDelete(item.Id)}
              variant="ghost"
              size="sm"
              borderRadius="lg"
              border="1px solid var(--chakra-colors-border-subtle)"
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

export default PlanCard;
