import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Drawer,
  HStack,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LuCheck, LuX } from 'react-icons/lu';
import { HabitDayDrawerProps } from '../types';
import { isHabitActiveOnDate } from '../util';
import { EmptyState } from '@components';
import HabitDayListItem from './HabitDayListItem';
import { HabitLogItem } from '@store';

/** Local draft state for a single habit's log on the selected date. */
interface DraftLog {
  habitId: string;
  completed: boolean;
  note: string;
}

/**
 * HabitDayDrawer Component.
 * Slide-out drawer displaying habit check-in checklist for the selected date.
 * All changes are held locally and only persisted when the Save button is clicked.
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

  // Local draft state — keyed by habitId
  const [drafts, setDrafts] = useState<Record<string, DraftLog>>({});
  const [isSaving, setIsSaving] = useState(false);

  /** Rebuild drafts from the current logs whenever the drawer opens or date changes */
  useEffect(() => {
    if (isOpen) {
      const initial: Record<string, DraftLog> = {};
      activeHabits.forEach((habit) => {
        const log = logs.find(
          (l) => l.habitId === habit.id && l.date === dateStr,
        );
        initial[habit.id] = {
          habitId: habit.id,
          completed: log?.completed ?? false,
          note: log?.note ?? '',
        };
      });
      setDrafts(initial);
      setIsSaving(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, dateStr]);

  /** Returns true if any draft differs from the persisted log */
  const hasChanges = Object.values(drafts).some((draft) => {
    const original = logs.find(
      (l) => l.habitId === draft.habitId && l.date === dateStr,
    );
    return (
      draft.completed !== (original?.completed ?? false) ||
      draft.note !== (original?.note ?? '')
    );
  });

  /** Update a single habit's draft in local state — no API call */
  const handleDraftChange = useCallback(
    (habitId: string, completed: boolean, note: string) => {
      setDrafts((prev) => ({
        ...prev,
        [habitId]: { habitId, completed, note },
      }));
    },
    [],
  );

  /** Save all dirty drafts in parallel */
  const handleSave = async () => {
    const dirtyDrafts = Object.values(drafts).filter((draft) => {
      const original = logs.find(
        (l) => l.habitId === draft.habitId && l.date === dateStr,
      );
      return (
        draft.completed !== (original?.completed ?? false) ||
        draft.note !== (original?.note ?? '')
      );
    });

    if (dirtyDrafts.length === 0) return;

    setIsSaving(true);
    try {
      await Promise.all(
        dirtyDrafts.map((draft) =>
          onSaveLog({
            habitId: draft.habitId,
            date: dateStr,
            completed: draft.completed,
            note: draft.note,
            loggedAt: new Date().toISOString(),
          }),
        ),
      );
      onClose();
    } finally {
      setIsSaving(false);
    }
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
          display="flex"
          flexDirection="column"
        >
          {/* Close button */}
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

          {/* Header */}
          <Drawer.Header
            borderBottom="1px solid"
            borderColor="border.subtle"
            py={4}
            px={6}
          >
            <Drawer.Title fontSize="lg" fontWeight="bold" color="text.primary">
              {t('HabitTracker.trackHabitsTitle', 'Track Habits')}
            </Drawer.Title>
            <Text fontSize="xs" color="text.secondary" mt={1} mr={10}>
              {t('HabitTracker.trackHabitsSubtitle', 'Logging checklist for')}{' '}
              {dateStr}
            </Text>
          </Drawer.Header>

          {/* Scrollable habit list */}
          <Drawer.Body py={5} px={6} overflowY="auto" flex={1}>
            {activeHabits.length > 0 ? (
              <VStack gap={3} align="stretch" w="100%">
                {activeHabits.map((habit) => {
                  const draft = drafts[habit.id];
                  // Build a synthetic log from draft so HabitDayListItem is controlled
                  const draftLog: HabitLogItem | undefined = draft
                    ? {
                        id: '',
                        habitId: habit.id,
                        date: dateStr,
                        completed: draft.completed,
                        note: draft.note,
                        loggedAt: '',
                      }
                    : undefined;

                  return (
                    <HabitDayListItem
                      key={habit.id}
                      habit={habit}
                      log={draftLog}
                      onToggle={(completed, note) =>
                        handleDraftChange(habit.id, completed, note)
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

          {/* Sticky Save Footer */}
          {activeHabits.length > 0 && (
            <Box
              borderTop="1px solid"
              borderColor="border.subtle"
              px={6}
              py={4}
              bg="bg.panel"
            >
              <HStack gap={3} justify="flex-end">
                <Button
                  variant="ghost"
                  color="text.secondary"
                  onClick={onClose}
                  disabled={isSaving}
                  size="sm"
                >
                  {t('HabitTracker.cancel', 'Cancel')}
                </Button>
                <Button
                  onClick={handleSave}
                  loading={isSaving}
                  disabled={!hasChanges}
                  size="sm"
                  gap={2}
                  px={5}
                  border="1.5px solid"
                  bg={hasChanges ? 'rgba(0, 216, 255, 0.15)' : 'transparent'}
                  color={hasChanges ? '#00D8FF' : 'text.secondary'}
                  borderColor={hasChanges ? '#00D8FF' : 'border.subtle'}
                  borderRadius="lg"
                  fontWeight="semibold"
                  opacity={hasChanges ? 1 : 0.45}
                  cursor={hasChanges ? 'pointer' : 'not-allowed'}
                  boxShadow={
                    hasChanges ? '0 0 12px rgba(0,216,255,0.3)' : 'none'
                  }
                  _hover={{
                    bg: hasChanges ? 'rgba(0, 216, 255, 0.25)' : 'transparent',
                    borderColor: hasChanges ? '#00D8FF' : 'border.subtle',
                  }}
                >
                  <LuCheck size={15} />
                  {t('HabitTracker.saveLog', 'Save')}
                </Button>
              </HStack>
            </Box>
          )}
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default HabitDayDrawer;
