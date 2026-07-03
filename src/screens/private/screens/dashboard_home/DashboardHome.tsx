import { useEffect, useState } from 'react';
import { Box, Grid, VStack } from '@chakra-ui/react';
import { appStore } from '@store';
import { useQueryClient } from '@tanstack/react-query';
import {
  useShallow,
  goalsSelector,
  learningsSelector,
  credsSelector,
  authNameSelector,
  plansSelector,
  projectsSelector,
  habitsSelector,
} from '@selectors';
import { getRecentGoals, getActiveGoalsCount } from './util';
import { RECENT_ITEMS_COUNT } from './const';
import { useGetPlansData, useGetProjectsData, useGetGoalsData, useGetLearningsData, useGetCredsData, useGetHabitsData, useGetHabitLogsData } from '@services/hooks/private';
import {
  GreetingHero,
  StatsTiles,
  RecentGoals,
  RecentLearnings,
  QuickActions,
  ExpenseSummary,
  DashboardTour,
} from './components';

/**
 * DashboardHome component.
 * Thin orchestrator that reads from the Zustand store, derives summary data,
 * and composes the Mission Control layout from focused sub-components.
 */
const DashboardHome = () => {
  // Store reads
  const userName = appStore(authNameSelector);
  const { goalsData } = appStore(useShallow(goalsSelector));
  const { learningsData } = appStore(useShallow(learningsSelector));
  const { credsData } = appStore(useShallow(credsSelector));
  const { plansData } = appStore(useShallow(plansSelector));
  const { projectData } = appStore(useShallow(projectsSelector));
  const { habitsData } = appStore(useShallow(habitsSelector));

  // Query triggers to populate dashboard stats
  useGetPlansData();
  useGetProjectsData();
  useGetGoalsData();
  useGetLearningsData();
  useGetCredsData();
  useGetHabitsData();
  useGetHabitLogsData();

  // Derived data
  const recentGoals = getRecentGoals(goalsData);
  const recentLearnings = [...learningsData]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, RECENT_ITEMS_COUNT);
  const activeGoalsCount = getActiveGoalsCount(goalsData);

  // Onboarding Tour state
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('growboard_dashboard_tour_seen');
    if (!hasSeenTour) {
      setRunTour(true);
    }
  }, []);

  const handleTourEnd = () => {
    setRunTour(false);
    localStorage.setItem('growboard_dashboard_tour_seen', 'true');
  };

  const handleStartTour = () => {
    setRunTour(true);
  };

  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // Clear lastFetched cache timestamps AND cached data arrays in Zustand to force a clean slate
      appStore.setState((state) => ({
        ...state,
        Goals: { ...state.Goals, goalsData: [], lastFetched: undefined },
        Projects: { ...state.Projects, projects: [], lastFetched: undefined },
        Plans: { ...state.Plans, plansData: [], lastFetched: undefined },
        Learnings: {
          ...state.Learnings,
          learningsData: [],
          lastFetched: undefined,
        },
        Resources: {
          ...state.Resources,
          resourcesData: [],
          lastFetched: undefined,
        },
        Expense: { ...state.Expense, expensesData: [], lastFetched: {} },
        Habits: {
          ...state.Habits,
          habitsData: [],
          habitLogsData: [],
          lastFetchedHabits: undefined,
          lastFetchedLogs: undefined,
        },
      }));

      // Invalidate all React Query queries to trigger immediate reload
      await queryClient.invalidateQueries();
    } catch (err) {
      console.error('Manual sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Box h="full" w="100%" p={4}>
      <DashboardTour run={runTour} onTourEnd={handleTourEnd} />
      <VStack gap={5} align="stretch">
        {/* Hero Greeting Strip */}
        <GreetingHero
          name={userName ?? 'there'}
          onStartTour={handleStartTour}
          onSync={handleSync}
          isSyncing={isSyncing}
        />

        {/* Stats Overview Tiles */}
        <StatsTiles
          goalsCount={goalsData.length}
          activeGoalsCount={activeGoalsCount}
          learningsCount={learningsData.length}
          credsCount={credsData.length}
          plansCount={plansData.length}
          projectsCount={projectData.length}
          habitsCount={habitsData.length}
        />

        {/* Recent Goals + Recent Learnings + Expense Summary — responsive grid */}
        <Grid
          className="tour-recent-activity"
          templateColumns={{ base: '1fr', lg: '1fr 1fr', xl: '1fr 1fr 1fr' }}
          gap={5}
        >
          <RecentGoals goals={recentGoals} />
          <RecentLearnings learnings={recentLearnings} />
          <ExpenseSummary />
        </Grid>

        {/* Quick Action Shortcuts */}
        <QuickActions />
      </VStack>
    </Box>
  );
};

export default DashboardHome;
