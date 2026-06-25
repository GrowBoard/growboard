import { HStack, Button, Text } from '@chakra-ui/react';
import { getPrevDate, getNextDate } from './utils';
import { appStore, TimeWindow } from '@store';
import { overviewInputSelector, useShallow } from '@selectors';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

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

  const LeftChevron = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );

  const RightChevron = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );

  // Dropdown style token integration
  const selectStyle: React.CSSProperties = {
    background: 'var(--chakra-colors-bg-panel)',
    border: '1px solid var(--chakra-colors-border-subtle)',
    borderRadius: '8px',
    color: 'var(--chakra-colors-text-primary)',
    padding: '4px 10px',
    fontSize: '14px',
    fontWeight: 600,
    outline: 'none',
    cursor: 'pointer',
    height: '34px',
  };

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
        <select value={month} onChange={handleMonthChange} style={selectStyle}>
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
        <select value={year} onChange={handleYearChange} style={selectStyle}>
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
