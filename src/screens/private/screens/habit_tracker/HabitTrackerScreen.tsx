import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Flex, Spinner, Text, VStack } from '@chakra-ui/react';
import { LuPlus, LuCalendarRange } from 'react-icons/lu';
import { useShallow, habitsSelector } from '@selectors';
import { appStore } from '@store';
import {
  useGetHabitsData,
  useGetHabitLogsData,
  useSaveHabitData,
  useDeleteHabitData,
  useUpsertHabitLog,
} from '@services/hooks/private';
import { useSuccessToast } from '@components';
import {
  HabitCalendar,
  HabitDayDrawer,
  AddHabitModal,
  SeeHabitModal,
} from './components';

/**
 * HabitTrackerScreen Component.
 * The primary screen orchestrator for the Habit Tracker module.
 * Embeds the full-screen calendar heat-map, tracking drawer, and modal popups.
 */
export const HabitTrackerScreen = () => {
  const { t } = useTranslation();
  const successToast = useSuccessToast();

  // Zustand Store Selectors
  const { habitsData, habitLogsData } = appStore(useShallow(habitsSelector));

  // Service Hook Queries
  const { isLoading: isLoadingHabits } = useGetHabitsData();
  const { isLoading: isLoadingLogs } = useGetHabitLogsData();

  // Service Hook Mutations
  const { mutateAsync: saveHabit } = useSaveHabitData();
  const { mutateAsync: deleteHabit } = useDeleteHabitData();
  const { mutateAsync: upsertLog } = useUpsertHabitLog();

  // Local View States
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Dialog Open States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSeeOpen, setIsSeeOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Edit State
  const [editHabitItem, setEditHabitItem] = useState<any>(null);

  const handleEditHabitClick = (habit: any) => {
    setEditHabitItem(habit);
    setIsSeeOpen(false);
    setIsAddOpen(true);
  };

  const handleMonthChange = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsDrawerOpen(true);
  };

  const handleSaveHabit = async (habitPayload: any) => {
    await saveHabit(habitPayload);
    successToast(t('HabitTracker.saveSuccess', 'Habit saved successfully!'));
  };

  const handleDeleteHabit = async (habitId: string) => {
    await deleteHabit(habitId);
    successToast(
      t('HabitTracker.deleteSuccess', 'Habit deleted successfully!'),
    );
  };

  const handleSaveLog = async (logPayload: any) => {
    await upsertLog(logPayload);
  };

  const isLoading = isLoadingHabits || isLoadingLogs;

  return (
    <Box
      h="full"
      w="100%"
      p={4}
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      {/* Top Header Section */}
      <Box
        top={0}
        zIndex={0}
        bg="bg.glass"
        backdropFilter="blur(12px)"
        border="1px solid"
        borderColor="border.subtle"
        p={1}
        px={3}
        borderRadius="xl"
        shadow="md"
        mb={6}
        gap={4}
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <VStack align="flex-start" gap={0}>
          <Box fontSize="2xl" fontWeight="bold" color="text.primary">
            {t('HabitTracker.title', 'Habit Tracker')}
          </Box>
          <Text fontSize="xs" color="text.secondary">
            {t(
              'HabitTracker.subtitle',
              'Track daily consistency and visual heat-map progress',
            )}
          </Text>
        </VStack>

        <Flex
          gap={3}
          w={{ base: '100%', md: 'auto' }}
          justify="flex-end"
          align="center"
        >
          <Button
            variant="outline"
            onClick={() => setIsSeeOpen(true)}
            disabled={isLoading || habitsData.length === 0}
            gap={2}
            borderRadius="lg"
            fontWeight="semibold"
            h="40px"
            px={4}
          >
            <LuCalendarRange size={16} />
            {t('HabitTracker.seeHabitBtn', 'See Habit')}
          </Button>

          <Button
            onClick={() => {
              setEditHabitItem(null);
              setIsAddOpen(true);
            }}
            disabled={isLoading}
            gap={2}
            bg="blue.600"
            color="white"
            borderRadius="lg"
            fontWeight="semibold"
            h="40px"
            px={4}
            shadow="md"
            transition="all 0.2s"
            _hover={{
              bg: 'blue.500',
              transform: 'translateY(-1px)',
            }}
            _active={{
              bg: 'blue.700',
              transform: 'translateY(0)',
            }}
          >
            <LuPlus size={16} />
            {t('HabitTracker.startHabitBtn', 'Start Habit')}
          </Button>
        </Flex>
      </Box>

      {/* Main Content Area */}
      <Box flex={1} w="100%" minH={0} overflowY="auto">
        {isLoading ? (
          <Flex justify="center" align="center" h="64" w="100%">
            <VStack gap={3}>
              <Spinner size="lg" color="border.focus" />
              <Text fontSize="sm" color="text.secondary">
                {t(
                  'PrivateScreen.loading',
                  'Loading data from Google Drive...',
                )}
              </Text>
            </VStack>
          </Flex>
        ) : (
          <HabitCalendar
            year={currentYear}
            month={currentMonth}
            habits={habitsData}
            logs={habitLogsData}
            onDayClick={handleDayClick}
            onMonthChange={handleMonthChange}
          />
        )}
      </Box>

      {/* Tracking Day Drawer */}
      {selectedDate && (
        <HabitDayDrawer
          dateStr={selectedDate}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          habits={habitsData}
          logs={habitLogsData}
          onSaveLog={handleSaveLog}
        />
      )}

      {/* Add / Edit Habit Modal Dialog */}
      <AddHabitModal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setEditHabitItem(null);
        }}
        onSaveHabit={handleSaveHabit}
        editItem={editHabitItem}
      />

      {/* Track Habit Details Modal Dialog */}
      <SeeHabitModal
        isOpen={isSeeOpen}
        onClose={() => setIsSeeOpen(false)}
        habits={habitsData}
        logs={habitLogsData}
        onDeleteHabit={handleDeleteHabit}
        onEditHabit={handleEditHabitClick}
      />
    </Box>
  );
};

export default HabitTrackerScreen;
