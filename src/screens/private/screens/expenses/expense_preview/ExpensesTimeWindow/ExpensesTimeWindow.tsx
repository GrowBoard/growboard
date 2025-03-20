import { VStack, HStack, Button, Text } from '@chakra-ui/react';
import { TimeWindowComponent, DateInput } from './sub_components';
import { TimeWindow } from '../types';
import { useState, useMemo, useEffect } from 'react';
import { getPrevDate, getNextDate } from '../utils';

const ExpensesTimeWindow = () => {
  const date = new Date();
  const [{ day, month, year }, setDate] = useState({
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
  });
  const today = date.toISOString().split('T')[0];

  const [timeWindow, setTimeWindow] = useState<TimeWindow>(TimeWindow.MONTH);
  const { startDate, endDate } = useMemo(
    () => ({
      startDate:
        month <= 9 ? `${year}-0${month + 1}-01` : `${year}-${month}-01`,
      endDate: today,
    }),
    [month, today, year],
  );
  console.log(startDate);
  const onLeftClick = () => setDate((prev) => getPrevDate(timeWindow, prev));

  const onRightClick = () => setDate((prev) => getNextDate(timeWindow, prev));

  const getWindowString = (window: TimeWindow) => {
    switch (window) {
      case TimeWindow.DAY:
        return (
          day.toString() +
          new Date(month).toLocaleString('default', { month: 'long' })
        );
      case TimeWindow.MONTH:
        return date.toLocaleString('default', { month: 'long' });
      case TimeWindow.YEAR:
        return year.toString();
    }
  };

  useEffect(() => {
    switch (timeWindow) {
      case TimeWindow.DAY:
        setDate((prev) => ({
          ...prev,
          day: prev.day - 1,
        }));
        break;
      case TimeWindow.MONTH:
        setDate({
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
        });
        break;
      case TimeWindow.YEAR:
        setDate({
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
        });
        break;
    }
  }, [date, timeWindow]);

  return (
    <VStack
      w={'40%'}
      alignItems={'start'}
      paddingX={2}
      borderRadius={10}
      p={3}
      shadow={'0px 0px 10px rgba(0, 0, 0, 0.25)'}
    >
      <Text fontSize={'md'} fontWeight={'semibold'} textAlign={'center'}>
        Expense Time Window
      </Text>
      <HStack w={'100%'} justifyContent={'space-between'}>
        <Button onClick={onLeftClick}>◀️</Button>
        <Text>
          {getWindowString(timeWindow)} {timeWindow}
        </Text>
        <Button onClick={onRightClick}>▶️</Button>
      </HStack>
      <HStack w={'100%'} justifyContent={'space-between'}>
        <Text fontSize={'md'} fontWeight={'semibold'} textAlign={'center'}>
          Time Period
        </Text>
        <TimeWindowComponent
          timeWindow={timeWindow}
          setTimeWindow={setTimeWindow}
        />
      </HStack>
      <HStack w={'100%'} justifyContent={'space-between'}>
        <DateInput
          text={'Start Date'}
          value={startDate}
          maxValue={endDate}
          setValue={(value) =>
            setDate((prev) => ({ ...prev, startDate: value }))
          }
        />
        <DateInput
          text={'End Date'}
          value={endDate}
          maxValue={today}
          setValue={(value) => setDate((prev) => ({ ...prev, endDate: value }))}
        />
      </HStack>
    </VStack>
  );
};

export default ExpensesTimeWindow;
