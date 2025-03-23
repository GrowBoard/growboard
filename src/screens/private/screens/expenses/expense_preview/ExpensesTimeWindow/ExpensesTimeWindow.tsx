import { VStack, HStack, Button, Text, Divider } from '@chakra-ui/react';
import { TimeWindowComponent, DateInput } from './sub_components';
import { useState, useMemo, useCallback } from 'react';
import { getPrevDate, getNextDate, getStartAndEndDate } from './utils';
import { getWindowString } from './utils';
import { appStore, TimeWindow } from '@store';
import { timeWindowSelector, useShallow } from '@selectors';

const date = new Date();

const ExpensesTimeWindow = () => {
  const timeWindow = appStore(useShallow(timeWindowSelector));
  const [{ day, month, year }, setDate] = useState({
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
  });
  const today = date.toISOString().split('T')[0];

  const onLeftClick = () => setDate((prev) => getPrevDate(timeWindow, prev));

  const onRightClick = () => setDate((prev) => getNextDate(timeWindow, prev));

  const { startDate, endDate } = useMemo(
    () => getStartAndEndDate(timeWindow, { day, month, year }),
    [timeWindow, day, month, year],
  );

  const onTimeWindowChange = useCallback((timeWindow: TimeWindow) => {
    switch (timeWindow) {
      case TimeWindow.DAY:
        setDate((prev) => ({
          ...prev,
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
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
  }, []);

  return (
    <VStack
      flex={1}
      w={'100%'}
      alignItems={'start'}
      paddingX={2}
      borderRadius={10}
      p={2}
      shadow={'0px 0px 10px rgba(0, 0, 0, 0.25)'}
    >
      <Text fontSize={'md'} fontWeight={'semibold'} textAlign={'center'}>
        Expense Time Window
      </Text>
      <HStack w={'100%'} alignItems={'start'}>
        <HStack
          w={'50%'}
          justifyContent={'space-between'}
          border={'1px solid rgba(0, 0, 0, 0.4)'}
          borderRadius={5}
          pr={1}
        >
          <Text
            width={'20%'}
            fontSize={'md'}
            p={2}
            fontWeight={'semibold'}
            textAlign={'start'}
            bg={'blue.200'}
          >
            Time window
          </Text>
          <HStack w={'80%'} justifyContent={'space-between'}>
            <Button size={'sm'} onClick={onLeftClick}>
              ◀️
            </Button>
            <Text
              fontSize={'md'}
              fontWeight={'semibold'}
              textAlign={'center'}
              width={'50%'}
            >
              {getWindowString(timeWindow, { day, month, year })}
            </Text>
            <Button
              size={'sm'}
              onClick={onRightClick}
              isDisabled={
                (timeWindow === TimeWindow.DAY && date.getDate() === day) ||
                (timeWindow === TimeWindow.MONTH &&
                  date.getMonth() === month) ||
                (timeWindow === TimeWindow.YEAR && date.getFullYear() === year)
              }
            >
              ▶️
            </Button>
          </HStack>
        </HStack>
        <HStack
          w={'50%'}
          pr={1}
          justifyContent={'space-between'}
          border={'1px solid rgba(0, 0, 0, 0.4)'}
          borderRadius={5}
        >
          <Text
            width={'20%'}
            fontSize={'md'}
            p={2}
            fontWeight={'semibold'}
            textAlign={'start'}
            bg={'blue.200'}
          >
            Time window
          </Text>
          <TimeWindowComponent onTimeWindowChange={onTimeWindowChange} />
        </HStack>
      </HStack>
      <Divider />
      <HStack width={'100%'}>
        <DateInput
          text={'Start date'}
          value={startDate}
          maxValue={endDate}
          setValue={(value) =>
            setDate((prev) => ({ ...prev, startDate: value }))
          }
        />
        <DateInput
          text={'End date'}
          value={endDate}
          maxValue={today}
          setValue={(value) => setDate((prev) => ({ ...prev, endDate: value }))}
        />
      </HStack>
    </VStack>
  );
};

export default ExpensesTimeWindow;
