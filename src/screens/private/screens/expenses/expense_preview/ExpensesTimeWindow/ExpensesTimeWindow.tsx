import { VStack, HStack, Button, Text, Divider } from '@chakra-ui/react';
import { TimeWindowComponent, DateInput } from './sub_components';
import { useMemo, useCallback } from 'react';
import { getPrevDate, getNextDate, getDateFromState } from './utils';
import { getWindowString } from './utils';
import { appStore, TimeWindow } from '@store';
import {
  dateSelector,
  overviewInputSelector,
  timeWindowSelector,
  todayDateSelector,
  useShallow,
} from '@selectors';

const ExpensesTimeWindow = () => {
  const timeWindow = appStore(useShallow(timeWindowSelector));
  const { dateState, setOverviewInputWithDay } = appStore(
    useShallow(overviewInputSelector),
  );
  const today = appStore(useShallow(todayDateSelector));
  const date = appStore(useShallow(dateSelector));
  const { day, month, year } = dateState;

  const onLeftClick = () =>
    setOverviewInputWithDay(getPrevDate(timeWindow, dateState));
  const onRightClick = () =>
    setOverviewInputWithDay(getNextDate(timeWindow, dateState));

  const { startDate } = useMemo(
    () => getDateFromState(timeWindow, { day, month, year }),
    [timeWindow, day, month, year],
  );

  const onTimeWindowChange = useCallback(
    (timeWindow: TimeWindow) => {
      switch (timeWindow) {
        case TimeWindow.DAY:
          setOverviewInputWithDay({
            ...dateState,
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear(),
          });
          break;
        case TimeWindow.MONTH:
          setOverviewInputWithDay({
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear(),
          });
          break;
        case TimeWindow.YEAR:
          setOverviewInputWithDay({
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear(),
          });
          break;
      }
    },
    [date],
  );

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
      {timeWindow === TimeWindow.DAY && (
        <HStack width={'100%'}>
          <DateInput
            text={'Date'}
            value={startDate}
            maxValue={today}
            setValue={(value) =>
              setOverviewInputWithDay({ ...dateState, day: Number(value) })
            }
          />
        </HStack>
      )}
    </VStack>
  );
};

export default ExpensesTimeWindow;
