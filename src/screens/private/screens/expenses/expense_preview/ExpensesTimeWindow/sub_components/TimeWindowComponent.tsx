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
      bgColor={isSelected ? 'blue.300' : 'white'}
      variant={'outline'}
      onClick={() => setTimeWindow(timeWindow)}
      size={'sm'}
      borderRadius={100}
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
    <HStack justifyContent={'space-between'} w={'80%'}>
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
