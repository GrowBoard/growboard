import { Joyride, Step, TooltipRenderProps, EventData, STATUS } from 'react-joyride';
import { useTranslation } from 'react-i18next';
import { Box, Flex, Text, Button, VStack } from '@chakra-ui/react';

interface DashboardTourProps {
  /** Controls whether the tour runs. */
  run: boolean;
  /** Callback fired when the tour ends (completed or skipped). */
  onTourEnd: () => void;
}

/**
 * DashboardTour component.
 * Manages step-by-step console onboarding using react-joyride.
 * Features a custom-styled tooltip aligning with Obsidian Flux glassmorphic theme.
 */
export const DashboardTour = ({ run, onTourEnd }: DashboardTourProps) => {
  const { t } = useTranslation();

  // Define the tour steps
  const steps: Step[] = [
    {
      target: '.tour-greeting-hero',
      title: t('DashboardTour.stepGreetingTitle'),
      content: t('DashboardTour.stepGreetingBody'),
      placement: 'bottom',
      skipBeacon: true,
    },
    {
      target: '.tour-sidebar-home',
      title: t('DashboardTour.stepHomeTitle'),
      content: t('DashboardTour.stepHomeBody'),
      placement: 'right',
    },
    {
      target: '.tour-sidebar-projects',
      title: t('DashboardTour.stepProjectsTitle'),
      content: t('DashboardTour.stepProjectsBody'),
      placement: 'right',
    },
    {
      target: '.tour-sidebar-plans',
      title: t('DashboardTour.stepPlansTitle'),
      content: t('DashboardTour.stepPlansBody'),
      placement: 'right',
    },
    {
      target: '.tour-sidebar-expenses',
      title: t('DashboardTour.stepExpensesTitle'),
      content: t('DashboardTour.stepExpensesBody'),
      placement: 'right',
    },
    {
      target: '.tour-sidebar-goals',
      title: t('DashboardTour.stepGoalsTitle'),
      content: t('DashboardTour.stepGoalsBody'),
      placement: 'right',
    },
    {
      target: '.tour-sidebar-learning',
      title: t('DashboardTour.stepLearningTitle'),
      content: t('DashboardTour.stepLearningBody'),
      placement: 'right',
    },
    {
      target: '.tour-sidebar-resources',
      title: t('DashboardTour.stepResourcesTitle'),
      content: t('DashboardTour.stepResourcesBody'),
      placement: 'right',
    },
    {
      target: '.tour-sidebar-credentials',
      title: t('DashboardTour.stepCredsTitle'),
      content: t('DashboardTour.stepCredsBody'),
      placement: 'right',
    },
    {
      target: '.tour-sidebar-profile',
      title: t('DashboardTour.stepProfileTitle'),
      content: t('DashboardTour.stepProfileBody'),
      placement: 'right',
    },
    {
      target: '.tour-stats-tiles',
      title: t('DashboardTour.stepStatsTitle'),
      content: t('DashboardTour.stepStatsBody'),
      placement: 'bottom',
    },
    {
      target: '.tour-recent-activity',
      title: t('DashboardTour.stepRecentActivityTitle'),
      content: t('DashboardTour.stepRecentActivityBody'),
      placement: 'top',
    },
    {
      target: '.tour-quick-actions',
      title: t('DashboardTour.stepQuickActionsTitle'),
      content: t('DashboardTour.stepQuickActionsBody'),
      placement: 'top',
    },
  ];

  // Callback to handle tour progression and exit states
  const handleJoyrideCallback = (data: EventData) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      onTourEnd();
    }
  };

  /** Custom tooltip component overlaying step guides. */
  const CustomTooltip = ({
    continuous,
    index,
    step,
    backProps,
    primaryProps,
    tooltipProps,
    skipProps,
    size,
  }: TooltipRenderProps) => {
    return (
      <Box
        {...tooltipProps}
        bg="bg.card"
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="2xl"
        p={5}
        maxW="340px"
        shadow="2xl"
        position="relative"
        className="tour-tooltip"
      >
        <VStack align="flex-start" gap={3}>
          {step.title && (
            <Text
              fontSize="sm"
              fontWeight="bold"
              color="border.focus"
              letterSpacing="wide"
              textTransform="uppercase"
            >
              {step.title}
            </Text>
          )}
          <Text fontSize="xs" color="text.secondary" lineHeight="relaxed">
            {step.content}
          </Text>

          <Flex w="full" mt={3} justify="space-between" align="center">
            {index > 0 ? (
              <Button
                {...backProps}
                size="xs"
                variant="ghost"
                color="text.secondary"
                _hover={{ bg: 'bg.active', color: 'text.primary' }}
              >
                {t('DashboardTour.btnBack')}
              </Button>
            ) : (
              <Button
                {...skipProps}
                size="xs"
                variant="ghost"
                color="text.muted"
                _hover={{ bg: 'bg.active', color: 'text.primary' }}
              >
                {t('DashboardTour.btnSkip')}
              </Button>
            )}

            <Button
              {...primaryProps}
              size="xs"
              bg="bg.active"
              color="text.primary"
              border="1px solid"
              borderColor="border.focus"
              _hover={{ bg: 'rgba(0, 216, 255, 0.25)' }}
              px={3}
            >
              {continuous && index < size - 1
                ? t('DashboardTour.btnNext')
                : t('DashboardTour.btnDone')}
            </Button>
          </Flex>
        </VStack>
      </Box>
    );
  };

  return (
    <Joyride
      run={run}
      steps={steps}
      onEvent={handleJoyrideCallback}
      continuous
      tooltipComponent={CustomTooltip}
      options={{
        buttons: ['back', 'close', 'primary', 'skip'],
        arrowColor: 'rgba(255, 255, 255, 0.07)', // Matches border.subtle
        overlayColor: 'rgba(18, 20, 22, 0.75)', // Dim overlay matching bg.app
        zIndex: 1000,
      }}
    />
  );
};
