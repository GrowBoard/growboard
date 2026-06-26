import { HStack, Button, Text } from '@chakra-ui/react';
import { getPrevDate, getNextDate } from './utils';
import { appStore, TimeWindow } from '@store';
import { overviewInputSelector, useShallow } from '@selectors';
import { MONTH_NAMES, SELECT_STYLE } from './const';
import { LeftChevron, RightChevron } from './components';

const ExpensesTimeWindow = () => {
  const { dateState, setOverviewInputWithDay } = appStore(
    useShallow(overviewInputSelector),
  );
  const today = new Date();
  const { month, year } = dateState;

  // Enforce TimeWindow.MONTH for the backend/sheets integrations
  const timeWindow = TimeWindow.MONTH;

  const onLeftClick = () =>
    setOverviewInputWithDay(getPrevDate(timeWindow, dateState));
  const onRightClick = () =>
    setOverviewInputWithDay(getNextDate(timeWindow, dateState));

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOverviewInputWithDay({
      ...dateState,
      month: parseInt(e.target.value, 10),
    });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOverviewInputWithDay({
      ...dateState,
      year: parseInt(e.target.value, 10),
    });
  };

  const isRightDisabled =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month >= today.getMonth());

  // Generate year options from 2024 to current year + 2
  const currentYear = today.getFullYear();
  const yearOptions = Array.from(
    { length: currentYear + 2 - 2024 + 1 },
    (_, i) => 2024 + i,
  );

  return (
    <HStack
      w={'100%'}
      justifyContent={'space-between'}
      alignItems={'center'}
      bg="bg.glass"
      backdropFilter="blur(24px)"
      borderRadius={'xl'}
      border={'1px solid'}
      borderColor="border.subtle"
      py={3}
      px={5}
      shadow={'xl'}
      flexDirection={{ base: 'column', sm: 'row' }}
      gap={3}
    >
      <Text
        fontSize={'sm'}
        fontWeight={'bold'}
        color="text.primary"
        letterSpacing="tight"
      >
        Expenses Period
      </Text>

      <HStack gap={2}>
        {/* Navigation arrow left */}
        <Button
          size={'sm'}
          variant="ghost"
          color="text.secondary"
          _hover={{ bg: 'bg.active', color: 'text.primary' }}
          onClick={onLeftClick}
          h="34px"
          w="34px"
          p={0}
          borderRadius="full"
        >
          <LeftChevron />
        </Button>

        {/* Month selector dropdown */}
        <select value={month} onChange={handleMonthChange} style={SELECT_STYLE}>
          {MONTH_NAMES.map((name, index) => (
            <option
              key={name}
              value={index}
              style={{ background: '#0e1116', color: 'white' }}
            >
              {name}
            </option>
          ))}
        </select>

        {/* Year selector dropdown */}
        <select value={year} onChange={handleYearChange} style={SELECT_STYLE}>
          {yearOptions.map((yr) => (
            <option
              key={yr}
              value={yr}
              style={{ background: '#0e1116', color: 'white' }}
            >
              {yr}
            </option>
          ))}
        </select>

        {/* Navigation arrow right */}
        <Button
          size={'sm'}
          variant="ghost"
          color="text.secondary"
          _hover={{ bg: 'bg.active', color: 'text.primary' }}
          onClick={onRightClick}
          disabled={isRightDisabled}
          opacity={isRightDisabled ? 0.3 : 1}
          h="34px"
          w="34px"
          p={0}
          borderRadius="full"
        >
          <RightChevron />
        </Button>
      </HStack>
    </HStack>
  );
};

export default ExpensesTimeWindow;
