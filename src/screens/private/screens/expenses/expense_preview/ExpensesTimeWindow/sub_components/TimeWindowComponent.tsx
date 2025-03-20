import { HStack, Radio, RadioGroup } from '@chakra-ui/react';
import { TimeWindow } from '../../types';

const TimeWindowComponent = ({
  timeWindow,
  setTimeWindow,
}: {
  timeWindow: TimeWindow;
  setTimeWindow: (timeWindow: TimeWindow) => void;
}) => {
  return (
    <RadioGroup
      defaultValue="day"
      w={'50%'}
      value={timeWindow}
      onChange={(e) => setTimeWindow(e as TimeWindow)}
    >
      <HStack justifyContent={'space-between'} w={'100%'}>
        <Radio value={TimeWindow.DAY}>Day</Radio>
        <Radio value={TimeWindow.MONTH}>Month</Radio>
        <Radio value={TimeWindow.YEAR}>Year</Radio>
      </HStack>
    </RadioGroup>
  );
};

export default TimeWindowComponent;
