import { useTranslation } from 'react-i18next';
import { Drawer, IconButton, Text, VStack } from '@chakra-ui/react';
import { LuX } from 'react-icons/lu';
import { HabitDayDrawerProps } from '../types';
import { isHabitActiveOnDate } from '../util';
import { EmptyState } from '@components';
import HabitDayListItem from './HabitDayListItem';

/**
 * HabitDayDrawer Component.
 * Slide-out drawer displaying habit check-in checklist for the selected date.
 */
export const HabitDayDrawer = ({
  dateStr,
  isOpen,
  onClose,
  habits,
  logs,
  onSaveLog,
}: HabitDayDrawerProps) => {
  const { t } = useTranslation();

  // Find active habits for this date
  const activeHabits = habits.filter((habit) =>
    isHabitActiveOnDate(habit, dateStr),
  );

  const handleToggleHabit = async (
    habitId: string,
    completed: boolean,
    note: string,
  ) => {
    await onSaveLog({
      habitId,
      date: dateStr,
      completed,
      note,
      loggedAt: new Date().toISOString(),
    });
  };

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(e: { open: boolean }) => {
        if (!e.open) onClose();
      }}
      placement="end"
      size="md"
    >
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
              aria-label="Close Drawer"
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
              Track Habits
            </Drawer.Title>
            <Text fontSize="xs" color="text.secondary" mt={1}>
              Logging checklist for {dateStr}
            </Text>
          </Drawer.Header>

          <Drawer.Body py={5} px={6} overflowY="auto" h="calc(100vh - 70px)">
            {activeHabits.length > 0 ? (
              <VStack gap={4} align="stretch" w="100%">
                {activeHabits.map((habit) => {
                  const log = logs.find(
                    (l) => l.habitId === habit.id && l.date === dateStr,
                  );
                  return (
                    <HabitDayListItem
                      key={habit.id}
                      habit={habit}
                      log={log}
                      onToggle={(completed, note) =>
                        handleToggleHabit(habit.id, completed, note)
                      }
                    />
                  );
                })}
              </VStack>
            ) : (
              <EmptyState
                title={t('HabitTracker.noHabitsForDay', 'No habits active')}
                description={t(
                  'HabitTracker.noHabitsForDayDesc',
                  'There are no habits scheduled to start on or before this date.',
                )}
              />
            )}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default HabitDayDrawer;
