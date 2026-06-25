import { Button, HStack } from '@chakra-ui/react';
import {
  setTimeWindowSelector,
  timeWindowSelector,
  useShallow,
} from '@selectors';
import { appStore, TimeWindow } from '@store';

const PillButton = ({
  isSelected,
  timeWindow,
  setTimeWindow,
}: {
  timeWindow: TimeWindow;
  isSelected: boolean;
  setTimeWindow: (timeWindow: TimeWindow) => void;
}) => {
  return (
    <Button
      value={timeWindow}
      bg={isSelected ? 'indigo.600' : 'transparent'}
      color={isSelected ? 'white' : 'text.muted'}
      _hover={{
        color: isSelected ? 'white' : 'text.primary',
        bg: isSelected ? 'indigo.500' : 'bg.active',
      }}
      onClick={() => setTimeWindow(timeWindow)}
      size={'xs'}
      borderRadius="full"
      transition="all 0.2s"
      px={4}
      h="24px"
      fontWeight={isSelected ? 'bold' : 'normal'}
    >
      {timeWindow}
    </Button>
  );
};

const TimeWindowComponent = ({
  onTimeWindowChange,
}: {
  onTimeWindowChange: (timeWindow: TimeWindow) => void;
}) => {
  const timeWindow = appStore(useShallow(timeWindowSelector));
  const setTimeWindow = appStore(useShallow(setTimeWindowSelector));

  const handleTimeWindowChange = (timeWindow: TimeWindow) => {
    setTimeWindow(timeWindow);
    onTimeWindowChange(timeWindow);
  };

  return (
    <HStack
      gap={0.5}
      bg="bg.panel"
      p={0.5}
      borderRadius="full"
      border="1px solid"
      borderColor="border.subtle"
    >
      <PillButton
        timeWindow={TimeWindow.DAY}
        setTimeWindow={handleTimeWindowChange}
        isSelected={timeWindow === TimeWindow.DAY}
      />
      <PillButton
        timeWindow={TimeWindow.MONTH}
        setTimeWindow={handleTimeWindowChange}
        isSelected={timeWindow === TimeWindow.MONTH}
      />
      <PillButton
        timeWindow={TimeWindow.YEAR}
        setTimeWindow={handleTimeWindowChange}
        isSelected={timeWindow === TimeWindow.YEAR}
      />
    </HStack>
  );
};

export default TimeWindowComponent;
