import { Box, Grid, Text, VStack, Icon } from '@chakra-ui/react';
import { LuTarget, LuBookOpen, LuKey, LuFlame, LuCalendarDays, LuFolder } from 'react-icons/lu';
import { StatsTilesProps } from '../types';

/**
 * StatTile sub-section.
 * Renders a single glassmorphic stat tile with icon, count, and label.
 */
const StatTile = ({
  icon,
  count,
  label,
  accentColor,
}: {
  icon: React.ReactNode;
  count: number;
  label: string;
  accentColor: string;
}) => (
  <Box
    bg="bg.glass"
    backdropFilter="blur(12px)"
    border="1px solid"
    borderColor="border.subtle"
    borderRadius="2xl"
    p={5}
    shadow="md"
    transition="all 0.2s"
    _hover={{ shadow: 'lg', borderColor: 'border.focus' }}
  >
    <VStack align="flex-start" gap={3}>
      <Box
        w="40px"
        h="40px"
        borderRadius="xl"
        bg="bg.active"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color={accentColor}
        fontSize="xl"
      >
        {icon}
      </Box>
      <VStack align="flex-start" gap={0}>
        <Text
          fontSize="3xl"
          fontWeight="bold"
          color="text.primary"
          lineHeight="1"
        >
          {count}
        </Text>
        <Text fontSize="sm" color="text.muted" mt={1}>
          {label}
        </Text>
      </VStack>
    </VStack>
  </Box>
);

/**
 * StatsTiles component.
 * Renders a responsive 6-tile grid summarising key counts from the user's data.
 */
export const StatsTiles = ({
  goalsCount,
  activeGoalsCount,
  learningsCount,
  credsCount,
  plansCount,
  projectsCount,
}: StatsTilesProps) => (
  <Grid
    className="tour-stats-tiles"
    templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }}
    gap={4}
  >
    <StatTile
      icon={<Icon as={LuTarget} />}
      count={goalsCount}
      label="Total Goals"
      accentColor="blue.400"
    />
    <StatTile
      icon={<Icon as={LuFlame} />}
      count={activeGoalsCount}
      label="Active Goals"
      accentColor="orange.400"
    />
    <StatTile
      icon={<Icon as={LuBookOpen} />}
      count={learningsCount}
      label="Learnings"
      accentColor="green.400"
    />
    <StatTile
      icon={<Icon as={LuKey} />}
      count={credsCount}
      label="Credentials"
      accentColor="purple.400"
    />
    <StatTile
      icon={<Icon as={LuCalendarDays} />}
      count={plansCount}
      label="Plans"
      accentColor="teal.400"
    />
    <StatTile
      icon={<Icon as={LuFolder} />}
      count={projectsCount}
      label="Projects"
      accentColor="pink.400"
    />
  </Grid>
);
