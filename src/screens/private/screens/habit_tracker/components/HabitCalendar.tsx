import {
  Box,
  Button,
  Grid,
  HStack,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { DAYS_OF_WEEK, MONTHS } from '../const';
import {
  calcDayCompletionStats,
  getHeatMapBgToken,
  getMonthGrid,
  formatLocalDate,
} from '../util';
import HabitCalendarDay from './HabitCalendarDay';
import { HabitCalendarProps } from '../types';

/**
 * HabitCalendar Component.
 * Full-screen calendar layout displaying monthly habit check-in status.
 */
export const HabitCalendar = ({
  year,
  month,
  habits,
  logs,
  onDayClick,
  onMonthChange,
}: HabitCalendarProps) => {
  const gridDates = getMonthGrid(year, month);
  const todayStr = formatLocalDate(new Date());

  const handlePrevMonth = () => {
    if (month === 0) {
      onMonthChange(year - 1, 11);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      onMonthChange(year + 1, 0);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  const handleToday = () => {
    const today = new Date();
    onMonthChange(today.getFullYear(), today.getMonth());
  };

  return (
    <VStack
      gap={5}
      align="stretch"
      w="100%"
      bg="bg.card"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="3xl"
      p={3}
      px={6}
      shadow="sm"
    >
      {/* Calendar Header Controls */}
      <HStack justify="flex-start" w="100%" px={1}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleToday}
          borderRadius="lg"
          px={4}
          _hover={{ bg: 'bg.active' }}
        >
          Today
        </Button>
        <HStack gap={3}>
          <IconButton
            aria-label="Previous Month"
            variant="ghost"
            onClick={handlePrevMonth}
            size="md"
            borderRadius="lg"
            _hover={{ bg: 'bg.active' }}
          >
            <LuChevronLeft size={20} />
          </IconButton>
          <Text
            fontSize="xl"
            fontWeight="bold"
            minW="48"
            textAlign="center"
            letterSpacing="tight"
            color="text.primary"
          >
            {MONTHS[month]} {year}
          </Text>
          <IconButton
            aria-label="Next Month"
            variant="ghost"
            onClick={handleNextMonth}
            size="md"
            borderRadius="lg"
            _hover={{ bg: 'bg.active' }}
          >
            <LuChevronRight size={20} />
          </IconButton>
        </HStack>
      </HStack>

      {/* Days of Week Header Grid */}
      <Grid
        templateColumns="repeat(7, 1fr)"
        gap={3}
        w="100%"
        textAlign="center"
        outline="1px solid"
        outlineColor="bg.muted"
        borderRadius="lg"
        outlineOffset={5}
      >
        {DAYS_OF_WEEK.map((day, idx) => {
          const isWeekend = idx === 0 || idx === 6;
          return (
            <Box key={day} py={1}>
              <Text
                fontSize="2xs"
                fontWeight="extrabold"
                color={isWeekend ? 'orange.400' : 'text.muted'}
                letterSpacing="wider"
                textTransform="uppercase"
              >
                {day.substring(0, 3)}
              </Text>
            </Box>
          );
        })}
      </Grid>

      {/* Calendar Day Grid */}
      <Grid
        templateColumns="repeat(7, 1fr)"
        gap={3}
        w="100%"
        flex={1}
        outline="1px solid"
        outlineColor="bg.muted"
        borderRadius="xl"
        outlineOffset={5}
        p={2}
      >
        {gridDates.map((dateStr, index) => {
          const isWeekend = index % 7 === 0 || index % 7 === 6;
          if (dateStr === null) {
            return (
              <HabitCalendarDay
                key={`empty-${index}`}
                day={null}
                dateStr={null}
                activeHabitsCount={0}
                completedHabitsCount={0}
                completionPercentage={0}
                heatMapBgToken="bg.habit.none"
                isToday={false}
                isWeekend={isWeekend}
              />
            );
          }

          const dayNum = parseInt(dateStr.split('-')[2], 10);
          const stats = calcDayCompletionStats(dateStr, habits, logs);
          const heatMapBgToken = getHeatMapBgToken(
            stats.percentage,
            stats.activeCount,
          );

          return (
            <HabitCalendarDay
              key={dateStr}
              day={dayNum}
              dateStr={dateStr}
              activeHabitsCount={stats.activeCount}
              completedHabitsCount={stats.completedCount}
              completionPercentage={stats.percentage}
              heatMapBgToken={heatMapBgToken}
              onClick={() => onDayClick(dateStr)}
              isToday={dateStr === todayStr}
              isWeekend={isWeekend}
            />
          );
        })}
      </Grid>

      {/* Heat-map Color Legend */}
      <HStack
        gap={4}
        justify="center"
        w="100%"
        pt={5}
        borderTop="1px solid"
        borderTopColor="border.subtle"
        flexWrap="wrap"
      >
        <Text fontSize="xs" fontWeight="bold" color="text.muted">
          Completion Rate:
        </Text>
        <HStack gap={1.5}>
          <Box
            w="3"
            h="3"
            borderRadius="sm"
            bg="bg.app"
            border="1px dashed"
            borderColor="border.subtle"
          />
          <Text fontSize="2xs" color="text.secondary" fontWeight="semibold">
            0% / Inactive
          </Text>
        </HStack>
        <HStack gap={1.5}>
          <Box w="3" h="3" borderRadius="sm" bg="rgba(34, 197, 94, 0.15)" />
          <Text fontSize="2xs" color="text.secondary" fontWeight="semibold">
            1–39%
          </Text>
        </HStack>
        <HStack gap={1.5}>
          <Box w="3" h="3" borderRadius="sm" bg="rgba(34, 197, 94, 0.4)" />
          <Text fontSize="2xs" color="text.secondary" fontWeight="semibold">
            40–69%
          </Text>
        </HStack>
        <HStack gap={1.5}>
          <Box w="3" h="3" borderRadius="sm" bg="rgba(34, 197, 94, 0.7)" />
          <Text fontSize="2xs" color="text.secondary" fontWeight="semibold">
            70–99%
          </Text>
        </HStack>
        <HStack gap={1.5}>
          <Box w="3" h="3" borderRadius="sm" bg="rgba(34, 197, 94, 0.9)" />
          <Text fontSize="2xs" color="text.secondary" fontWeight="semibold">
            100%
          </Text>
        </HStack>
      </HStack>
    </VStack>
  );
};

export default HabitCalendar;
