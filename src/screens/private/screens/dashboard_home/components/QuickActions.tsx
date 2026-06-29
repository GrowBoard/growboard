import { Box, Flex, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  LuPlus,
  LuBookOpen,
  LuCreditCard,
  LuChartColumn,
  LuCalendarDays,
  LuFolder,
} from 'react-icons/lu';
import { QuickActionsProps } from '../types';

/**
 * QuickActions component.
 * Renders a row of shortcut action buttons for the most common navigation tasks.
 */
export const QuickActions = (_props: QuickActionsProps) => {
  const navigate = useNavigate();

  /** Quick action button configuration list. */
  const actions = [
    { label: 'Add Goal', icon: <LuPlus />, route: '/goals', color: 'blue.400' },
    { label: 'Add Learning', icon: <LuBookOpen />, route: '/learning', color: 'green.400' },
    { label: 'Credentials', icon: <LuCreditCard />, route: '/creds', color: 'purple.400' },
    { label: 'Expenses', icon: <LuChartColumn />, route: '/expenses', color: 'orange.400' },
    { label: 'Plans', icon: <LuCalendarDays />, route: '/plans', color: 'teal.400' },
    { label: 'Projects', icon: <LuFolder />, route: '/projects', color: 'pink.400' },
  ];

  return (
    <Box
      bg="bg.card"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="2xl"
      p={5}
      shadow="sm"
    >
      <Flex
        gap={3}
        flexWrap="wrap"
        justify={{ base: 'flex-start', md: 'center' }}
      >
        {actions.map(({ label, icon, route, color }) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            gap={2}
            px={4}
            borderColor="border.subtle"
            color="text.secondary"
            _hover={{
              borderColor: color,
              color: color,
              bg: 'bg.active',
            }}
            transition="all 0.2s"
            onClick={() => navigate(route)}
          >
            {icon}
            {label}
          </Button>
        ))}
      </Flex>
    </Box>
  );
};
