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
 * All changes propagate to the parent via onToggle to update draft state —
 * no API calls are made from this component.
 */
export const HabitDayListItem = ({
  habit,
  log,
  onToggle,
}: HabitDayListItemProps) => {
  const isCompleted = log?.completed ?? false;
  const [noteText, setNoteText] = useState(log?.note ?? '');

  // Keep noteText in sync with the parent-controlled draft log
  useEffect(() => {
    setNoteText(log?.note ?? '');
  }, [log?.note]);

  const handleCheckboxToggle = () => {
    onToggle(!isCompleted, noteText);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNoteText(val);
    // Propagate note changes to parent draft immediately
    onToggle(isCompleted, val);
  };

  return (
    <Box
      p={2}
      bg="bg.card"
      border="1px solid"
      borderColor={isCompleted ? 'rgba(0,216,255,0.25)' : 'border.subtle'}
      borderRadius="xl"
      w="100%"
      transition="all 0.2s"
      _hover={{ borderColor: 'border.focus' }}
    >
      <VStack align="stretch" gap={2}>
        <Flex justify="space-between" align="center">
          <HStack gap={2}>
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
          px={2}
          outline="1px solid rgba(0,216,255,0.25)"
          variant="outline"
          value={noteText}
          onChange={handleNoteChange}
          borderColor="border.subtle"
          bg="bg.panel"
          _focus={{ borderColor: 'border.focus' }}
        />
      </VStack>
    </Box>
  );
};

export default HabitDayListItem;
