import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LuSquareCheck, LuSquare } from 'react-icons/lu';
import { HabitDayListItemProps } from '../types';

/**
 * HabitDayListItem Component.
 * Represents a single habit trackable row in the day drawer.
 */
export const HabitDayListItem = ({
  habit,
  log,
  onToggle,
}: HabitDayListItemProps) => {
  const isCompleted = log?.completed ?? false;
  const [noteText, setNoteText] = useState(log?.note ?? '');

  // Keep noteText synced when log changes
  useEffect(() => {
    setNoteText(log?.note ?? '');
  }, [log]);

  const handleCheckboxToggle = () => {
    onToggle(!isCompleted, noteText);
  };

  const handleNoteBlur = () => {
    // Only save note if it has actually changed or differs from log
    if (noteText !== (log?.note ?? '')) {
      onToggle(isCompleted, noteText);
    }
  };

  return (
    <Box
      p={4}
      bg="bg.card"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="xl"
      w="100%"
      transition="all 0.2s"
      _hover={{ borderColor: 'border.focus' }}
    >
      <VStack align="stretch" gap={3}>
        <Flex justify="space-between" align="center">
          <HStack gap={3}>
            <IconButton
              aria-label={
                isCompleted ? 'Mark Habit Uncompleted' : 'Mark Habit Completed'
              }
              variant="ghost"
              onClick={handleCheckboxToggle}
              color={isCompleted ? 'green.400' : 'text.muted'}
              _hover={{
                bg: 'bg.active',
                color: isCompleted ? 'green.500' : 'text.primary',
              }}
              size="sm"
            >
              {isCompleted ? (
                <LuSquareCheck size={22} />
              ) : (
                <LuSquare size={22} />
              )}
            </IconButton>
            <VStack align="flex-start" gap={0}>
              <Text
                fontWeight="semibold"
                fontSize="sm"
                color="text.primary"
                textDecoration={isCompleted ? 'line-through' : 'none'}
                opacity={isCompleted ? 0.7 : 1}
              >
                {habit.name}
              </Text>
              <Text fontSize="2xs" color="text.muted">
                Target: {habit.targetPercentage}%
              </Text>
            </VStack>
          </HStack>
        </Flex>

        {/* Optional Note Field */}
        <Input
          placeholder="Add progress note..."
          size="xs"
          variant="outline"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onBlur={handleNoteBlur}
          borderColor="border.subtle"
          bg="bg.panel"
          _focus={{ borderColor: 'border.focus' }}
        />
      </VStack>
    </Box>
  );
};

export default HabitDayListItem;
