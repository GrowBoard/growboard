import { Box, Text, VStack, Flex } from '@chakra-ui/react';
import { HabitCalendarDayProps } from '../types';

/**
 * HabitCalendarDay Component.
 * Represents a single day cell in the full-screen calendar grid.
 * Colored based on completion percentage.
 */
export const HabitCalendarDay = ({
  day,
  dateStr,
  activeHabitsCount,
  completedHabitsCount,
  completionPercentage,
  heatMapBgToken,
  onClick,
  isToday,
  isWeekend = false,
}: HabitCalendarDayProps) => {
  if (day === null || dateStr === null) {
    return (
      <Box
        h="24"
        w="100%"
        bg="bg.app"
        border="1px dashed"
        borderColor="border.subtle"
        borderRadius="xl"
        opacity={0.3}
      />
    );
  }

  const hasHabits = activeHabitsCount > 0;

  // Decide high-contrast text color and progress bar color based on heat-map intensity
  const isHighContrastGreen =
    heatMapBgToken === 'bg.habit.high' || heatMapBgToken === 'bg.habit.full';

  // Weekend styling: soft orange tint if no habits are active/completed on this day
  const cellBg =
    heatMapBgToken === 'bg.habit.none'
      ? isWeekend
        ? 'rgba(249, 115, 22, 0.04)'
        : 'transparent'
      : heatMapBgToken;

  const textColor = isHighContrastGreen ? 'white' : 'text.primary';

  // Highlight day number in orange if it's weekend and not filled green
  const dayNumberColor = isHighContrastGreen
    ? 'white'
    : isToday
      ? 'text.primary'
      : isWeekend
        ? 'orange.400'
        : 'text.secondary';

  const mutedTextColor = isHighContrastGreen ? 'whiteAlpha.800' : 'text.muted';
  const progressBg = isHighContrastGreen
    ? 'rgba(255, 255, 255, 0.25)'
    : 'border.subtle';
  const progressFill = isHighContrastGreen ? 'white' : 'green.500';

  return (
    <Box
      w="100%"
      p={3}
      bg={cellBg}
      border="1px solid"
      borderColor={isToday ? 'border.focus' : 'border.subtle'}
      borderRadius="xl"
      cursor="pointer"
      transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        borderColor: 'border.focus',
        transform: 'translateY(-2px)',
        shadow: isHighContrastGreen ? 'md' : 'sm',
        bg:
          heatMapBgToken === 'bg.habit.none'
            ? isWeekend
              ? 'rgba(249, 115, 22, 0.08)'
              : 'bg.active'
            : undefined,
      }}
      onClick={onClick}
      position="relative"
    >
      <VStack align="stretch" justify="space-between" h="100%" gap={2}>
        <Flex w="100%" justify="space-between" align="center">
          <Text
            fontWeight={isToday || isWeekend ? 'bold' : 'medium'}
            color={dayNumberColor}
            fontSize="xl"
            lineHeight="none"
          >
            {day}
          </Text>
          {isToday && (
            <Box
              w="2"
              h="2"
              borderRadius="full"
              bg={isHighContrastGreen ? 'white' : 'border.focus'}
              shadow="sm"
            />
          )}
        </Flex>

        {hasHabits ? (
          <VStack align="stretch" gap={1.5} mt="auto">
            <Flex justify="space-between" align="center">
              <Text fontSize="2xs" color={mutedTextColor} fontWeight="semibold">
                {completedHabitsCount}/{activeHabitsCount} Done
              </Text>
              <Text fontSize="2xs" fontWeight="bold" color={textColor}>
                {completionPercentage}%
              </Text>
            </Flex>

            {/* Visual Micro Progress Bar */}
            <Box
              w="100%"
              h="1.5"
              bg={progressBg}
              borderRadius="full"
              overflow="hidden"
            >
              <Box
                w={`${completionPercentage}%`}
                h="100%"
                bg={progressFill}
                borderRadius="full"
                transition="width 0.3s ease-out"
              />
            </Box>
          </VStack>
        ) : (
          <Text fontSize="3xs" color={mutedTextColor} mt="auto">
            No habits active
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default HabitCalendarDay;
