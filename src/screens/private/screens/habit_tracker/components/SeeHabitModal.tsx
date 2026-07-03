import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  HStack,
  NativeSelectRoot,
  NativeSelectField,
  Text,
  VStack,
  Box,
  Heading,
  Grid,
  Badge,
} from '@chakra-ui/react';
import { DialogContainer } from '@components';
import { SeeHabitModalProps } from '../types';
import {
  LuTrash2,
  LuPencil,
  LuSquareCheck,
  LuCalendar,
  LuTarget,
} from 'react-icons/lu';

/**
 * SeeHabitModal Component.
 * Modal allowing the user to select any habit and view its details, statistics, and log history.
 * Supports editing and deleting the selected habit.
 */
export const SeeHabitModal = ({
  isOpen,
  onClose,
  habits,
  logs,
  onDeleteHabit,
  onEditHabit,
}: SeeHabitModalProps) => {
  const { t } = useTranslation();

  const [selectedHabitId, setSelectedHabitId] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Auto-select the first habit if none is selected
  useEffect(() => {
    if (isOpen) {
      if (habits.length > 0) {
        setSelectedHabitId(habits[0].id);
      } else {
        setSelectedHabitId('');
      }
      setDeleteConfirm(false);
      setIsDeleting(false);
    }
  }, [isOpen, habits]);

  const selectedHabit = habits.find((h) => h.id === selectedHabitId);

  // Filter logs for this specific habit
  const habitLogs = logs.filter((log) => log.habitId === selectedHabitId);
  const completedCount = habitLogs.filter((log) => log.completed).length;

  // Calculate consistency percentage
  const completionRate =
    habitLogs.length > 0
      ? Math.round((completedCount / habitLogs.length) * 100)
      : 0;

  const handleDelete = async () => {
    if (!selectedHabitId || !onDeleteHabit) return;
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    try {
      setIsDeleting(true);
      await onDeleteHabit(selectedHabitId);
      onClose();
    } catch (err) {
      console.error('Failed to delete habit:', err);
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(false);
    }
  };

  const handleOpenChange = (e: { open: boolean }) => {
    if (!e.open) onClose();
  };

  return (
    <DialogContainer
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      title={t('HabitTracker.seeHabitTitle', 'Track / Inspect Habit')}
      maxW="lg"
      footer={
        <HStack gap={3} justify="space-between" w="full">
          {selectedHabit && onDeleteHabit ? (
            <Button
              px={2}
              variant="outline"
              bg={deleteConfirm ? 'red.600' : 'transparent'}
              color={deleteConfirm ? 'white' : 'red.400'}
              onClick={handleDelete}
              loading={isDeleting}
              size="sm"
              gap={2}
              borderRadius="md"
              transition="all 0.2s"
              _hover={{
                bg: deleteConfirm ? 'red.500' : 'rgba(239, 68, 68, 0.08)',
                borderColor: 'red.500',
              }}
            >
              <LuTrash2 size={14} />
              {deleteConfirm
                ? t('HabitTracker.confirmDelete', 'Confirm?')
                : t('HabitTracker.delete', 'Delete')}
            </Button>
          ) : (
            <Box />
          )}
          <HStack gap={3}>
            {selectedHabit && onEditHabit && (
              <Button
                variant="surface"
                onClick={() => onEditHabit(selectedHabit)}
                disabled={isDeleting}
                size="sm"
                borderRadius="md"
                gap={1.5}
                px={2}
                borderColor="border.subtle"
                _hover={{ bg: 'bg.active', borderColor: 'border.focus' }}
              >
                <LuPencil size={13} />
                {t('HabitTracker.edit', 'Edit')}
              </Button>
            )}
            <Button
              px={3}
              variant="surface"
              onClick={onClose}
              disabled={isDeleting}
              size="sm"
              borderRadius="md"
              _hover={{ bg: 'bg.active' }}
            >
              {t('HabitTracker.close', 'Close')}
            </Button>
          </HStack>
        </HStack>
      }
    >
      <VStack gap={2} align="stretch" py={1}>
        {/* Habit Selector Dropdown Card (Sleek Glassmorphic Container) */}
        {habits.length > 0 ? (
          <Box
            bg="bg.card"
            p={2}
            borderRadius="xl"
            border="1px solid"
            borderColor="border.subtle"
          >
            <VStack align="stretch" gap={1}>
              <Text
                fontWeight="bold"
                fontSize="10px"
                color="text.muted"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                {t('HabitTracker.selectHabitLabel', 'Select Habit')}
              </Text>
              <NativeSelectRoot size="sm">
                <NativeSelectField
                  value={selectedHabitId}
                  pl={2}
                  onChange={(e) => {
                    setSelectedHabitId(e.target.value);
                    setDeleteConfirm(false);
                  }}
                  bg="bg.panel"
                  borderColor="border.subtle"
                  borderRadius="lg"
                  fontSize="sm"
                  fontWeight="medium"
                  _focus={{ borderColor: 'border.focus' }}
                >
                  {habits.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </NativeSelectField>
              </NativeSelectRoot>
            </VStack>
          </Box>
        ) : (
          <Text fontSize="sm" color="text.muted" textAlign="center" py={4}>
            {t(
              'HabitTracker.noHabitsAvailable',
              'No habits created yet. Start a habit first.',
            )}
          </Text>
        )}

        {/* Selected Habit details and statistics */}
        {selectedHabit && (
          <VStack align="stretch" gap={2} mt={1}>
            {/* Header info card */}
            <Box
              bg="rgba(255, 255, 255, 0.02)"
              p={2}
              borderRadius="xl"
              border="1px solid"
              borderColor="border.subtle"
            >
              <VStack align="stretch" gap={1}>
                <HStack justify="space-between" align="center">
                  <Heading fontSize="xs" fontWeight="bold" color="text.primary">
                    {selectedHabit.name}
                  </Heading>
                  <HStack gap={1} color="text.muted">
                    <LuCalendar size={13} />
                    <Text
                      fontSize="10px"
                      fontWeight="semibold"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Active since: {selectedHabit.startDate}{' '}
                      {selectedHabit.endDate
                        ? `to ${selectedHabit.endDate}`
                        : '(Open-ended)'}
                    </Text>
                  </HStack>
                </HStack>

                {/* Repeat Days display */}
                <HStack gap={1} mt={1} wrap="wrap" align="center">
                  <Text
                    fontSize="10px"
                    fontWeight="bold"
                    color="text.muted"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Repeat:
                  </Text>
                  {selectedHabit.days && selectedHabit.days.length > 0 ? (
                    selectedHabit.days.length === 7 ? (
                      <Badge
                        bg="rgba(0, 216, 255, 0.1)"
                        color="cyan.400"
                        borderColor="rgba(0, 216, 255, 0.2)"
                        variant="outline"
                        fontSize="9px"
                        fontWeight="bold"
                        borderRadius="md"
                        px={1.5}
                        py={0.5}
                      >
                        Every day
                      </Badge>
                    ) : (
                      selectedHabit.days.map((dayValue) => {
                        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        return (
                          <Badge
                            key={dayValue}
                            bg="bg.active"
                            color="text.primary"
                            borderColor="border.subtle"
                            variant="outline"
                            fontSize="9px"
                            fontWeight="bold"
                            borderRadius="md"
                            px={1.5}
                            py={0.5}
                          >
                            {dayNames[dayValue]}
                          </Badge>
                        );
                      })
                    )
                  ) : (
                    <Badge
                      bg="rgba(0, 216, 255, 0.1)"
                      color="cyan.400"
                      borderColor="rgba(0, 216, 255, 0.2)"
                      variant="outline"
                      fontSize="9px"
                      fontWeight="bold"
                      borderRadius="md"
                      px={1.5}
                      py={0.5}
                    >
                      Every day
                    </Badge>
                  )}
                </HStack>

                {/* Progress Consistency bar */}
                <VStack align="stretch" gap={1} mt={1}>
                  <HStack justify="space-between" align="center">
                    <Text
                      fontSize="10px"
                      fontWeight="bold"
                      color="text.muted"
                      textTransform="uppercase"
                      letterSpacing="wider"
                    >
                      Completion Consistency
                    </Text>
                    <Text fontSize="10px" fontWeight="bold" color="green.400">
                      {completionRate}%
                    </Text>
                  </HStack>
                  <Box
                    w="full"
                    h="1.5"
                    bg="rgba(255,255,255,0.05)"
                    borderRadius="full"
                    overflow="hidden"
                  >
                    <Box
                      w={`${completionRate}%`}
                      h="full"
                      bg="linear-gradient(90deg, #10B981, #059669)"
                      borderRadius="full"
                      transition="width 0.4s ease-out"
                    />
                  </Box>
                </VStack>
              </VStack>
            </Box>

            {/* Statistics Row Grid */}
            <Grid templateColumns="repeat(3, 1fr)" gap={3}>
              {/* Stat 1: Days Logged */}
              <Box
                bg="bg.card"
                p={3}
                borderRadius="xl"
                border="1px solid"
                borderColor="border.subtle"
                textAlign="center"
              >
                <Text fontSize="md" fontWeight="bold" color="text.primary">
                  {habitLogs.length}
                </Text>
                <Text
                  fontSize="10px"
                  color="text.muted"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mt={0.5}
                >
                  Days Logged
                </Text>
              </Box>

              {/* Stat 2: Completions */}
              <Box
                bg="rgba(16, 185, 129, 0.03)"
                p={3}
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(16, 185, 129, 0.15)"
                textAlign="center"
                _hover={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}
                transition="border 0.2s"
              >
                <Text fontSize="md" fontWeight="bold" color="green.400">
                  {completedCount}
                </Text>
                <Text
                  fontSize="10px"
                  color="green.500"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mt={0.5}
                >
                  Completions
                </Text>
              </Box>

              {/* Stat 3: Daily Target */}
              <Box
                bg="rgba(6, 182, 212, 0.03)"
                p={3}
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(6, 182, 212, 0.15)"
                textAlign="center"
                _hover={{ borderColor: 'rgba(6, 182, 212, 0.3)' }}
                transition="border 0.2s"
              >
                <Text fontSize="md" fontWeight="bold" color="cyan.400">
                  {selectedHabit.targetPercentage}%
                </Text>
                <Text
                  fontSize="10px"
                  color="cyan.500"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mt={0.5}
                >
                  Daily Target
                </Text>
              </Box>
            </Grid>

            {/* Check-in Logs vertical connection timeline */}
            <VStack align="stretch" gap={2}>
              <HStack gap={2} align="center">
                <LuTarget size={13} color="var(--chakra-colors-text-muted)" />
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="text.muted"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Check-in History & Logs
                </Text>
              </HStack>

              <Box
                position="relative"
                minH="24"
                maxH="56"
                overflowY="auto"
                pr={1.5}
              >
                {habitLogs.length > 0 ? (
                  <VStack align="stretch" gap={3} position="relative" pl={6}>
                    {/* Vertical timeline track line */}
                    <Box
                      position="absolute"
                      left="13px"
                      top="3px"
                      bottom="10px"
                      w="0.5"
                      bg="border.subtle"
                      opacity={0.6}
                      zIndex={0}
                    />

                    {habitLogs
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((log) => {
                        const isCompleted = log.completed;
                        return (
                          <Box key={log.id} position="relative" zIndex={1}>
                            {/* Timeline Node Point indicator */}
                            <Box
                              position="absolute"
                              left="-19px"
                              top="3.5px"
                              w="2.5"
                              h="2.5"
                              borderRadius="full"
                              bg={isCompleted ? 'green.400' : 'red.400'}
                              border="2.5px solid"
                              borderColor="bg.panel"
                              boxShadow={
                                isCompleted
                                  ? '0 0 8px rgba(16,185,129,0.5)'
                                  : 'none'
                              }
                            />

                            {/* Timeline Content Block (Glassmorphic Activity Item) */}
                            <Box
                              p={2.5}
                              bg="bg.card"
                              borderRadius="lg"
                              border="1px solid"
                              borderColor="border.subtle"
                              _hover={{
                                borderColor: 'border.focus',
                                transform: 'translateX(2px)',
                              }}
                              transition="all 0.2s"
                            >
                              <HStack justify="space-between" align="center">
                                <VStack align="flex-start" gap={0.5}>
                                  <Text
                                    fontSize="sm"
                                    fontWeight="semibold"
                                    color="text.primary"
                                  >
                                    {log.date}
                                  </Text>
                                  {log.note && (
                                    <Text
                                      fontSize="xs"
                                      color="text.secondary"
                                      fontStyle="italic"
                                    >
                                      Note: {log.note}
                                    </Text>
                                  )}
                                </VStack>
                                <HStack gap={1}>
                                  {isCompleted && (
                                    <LuSquareCheck
                                      size={11}
                                      color="var(--chakra-colors-green-400)"
                                    />
                                  )}
                                  <Text
                                    fontSize="xs"
                                    fontWeight="bold"
                                    textTransform="uppercase"
                                    letterSpacing="wide"
                                    color={
                                      isCompleted ? 'green.400' : 'red.400'
                                    }
                                  >
                                    {isCompleted ? 'Done' : 'Missed'}
                                  </Text>
                                </HStack>
                              </HStack>
                            </Box>
                          </Box>
                        );
                      })}
                  </VStack>
                ) : (
                  <Box
                    py={6}
                    textAlign="center"
                    bg="bg.card"
                    borderRadius="lg"
                    border="1px dashed"
                    borderColor="border.subtle"
                  >
                    <Text fontSize="sm" color="text.muted">
                      No check-in entries logged yet.
                    </Text>
                  </Box>
                )}
              </Box>
            </VStack>
          </VStack>
        )}
      </VStack>
    </DialogContainer>
  );
};

export default SeeHabitModal;
