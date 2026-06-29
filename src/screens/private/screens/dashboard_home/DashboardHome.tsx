import { Box, Grid, VStack } from '@chakra-ui/react';
import { appStore } from '@store';
import { useShallow, goalsSelector, learningsSelector, credsSelector, authNameSelector, plansSelector, projectsSelector } from '@selectors';
import { getRecentGoals, getActiveGoalsCount } from './util';
import { RECENT_ITEMS_COUNT } from './const';
import {
  useGetPlansData,
  useGetProjectsData,
} from '@services/hooks/private';
import {
  GreetingHero,
  StatsTiles,
  RecentGoals,
  RecentLearnings,
  QuickActions,
  ExpenseSummary,
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

  // Query triggers to populate dashboard stats
  useGetPlansData();
  useGetProjectsData();

  // Derived data
  const recentGoals = getRecentGoals(goalsData);
  const recentLearnings = [...learningsData]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, RECENT_ITEMS_COUNT);
  const activeGoalsCount = getActiveGoalsCount(goalsData);

  return (
    <Box h="full" w="100%" p={4}>
      <VStack gap={5} align="stretch">
        {/* Hero Greeting Strip */}
        <GreetingHero name={userName ?? 'there'} />

        {/* Stats Overview Tiles */}
        <StatsTiles
          goalsCount={goalsData.length}
          activeGoalsCount={activeGoalsCount}
          learningsCount={learningsData.length}
          credsCount={credsData.length}
          plansCount={plansData.length}
          projectsCount={projectData.length}
        />

        {/* Recent Goals + Recent Learnings + Expense Summary — responsive grid */}
        <Grid
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
