import { Box, Flex, Text, HStack, VStack, Badge } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { RecentGoalsProps } from '../types';

/**
 * RecentGoals component.
 * Renders a horizontal scroll of the most recently updated goals
 * with a "View all" shortcut to the Goals screen.
 */
export const RecentGoals = ({ goals }: RecentGoalsProps) => {
  const navigate = useNavigate();

  /**
   * Returns the correct color palette string for a goal's status badge.
   */
  const getStatusColor = (status: string): string => {
    if (status === 'In-Progress') return 'blue';
    if (status === 'Completed') return 'green';
    return 'gray';
  };

  return (
    <Box
      bg="bg.card"
      border="1px solid"
      borderColor="border.subtle"
      borderRadius="2xl"
      p={5}
      shadow="sm"
    >
      {/* Section header */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="md" fontWeight="bold" color="text.primary">
          🎯 Recent Goals
        </Text>
        <Text
          fontSize="sm"
          color="blue.400"
          cursor="pointer"
          _hover={{ textDecoration: 'underline' }}
          onClick={() => navigate('/goals')}
        >
          View all →
        </Text>
      </Flex>

      {goals.length === 0 ? (
        <Text fontSize="sm" color="text.muted" fontStyle="italic">
          No goals yet. Head to Goals to create one.
        </Text>
      ) : (
        <HStack
          gap={4}
          overflowX="auto"
          pb={2}
          css={{ scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
        >
          {goals.map((goal) => (
            <Box
              key={goal.title}
              minW="220px"
              maxW="220px"
              bg="bg.panel"
              border="1px solid"
              borderColor="border.subtle"
              borderRadius="xl"
              p={4}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ borderColor: 'border.focus', shadow: 'md' }}
              onClick={() => navigate('/goals')}
              flexShrink={0}
            >
              <VStack align="flex-start" gap={2}>
                {/* Status badge */}
                <Badge
                  colorPalette={getStatusColor(goal.status)}
                  variant="solid"
                  size="sm"
                  borderRadius="md"
                >
                  {goal.status}
                </Badge>

                {/* Title */}
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="text.primary"
                  lineClamp={2}
                >
                  {goal.title}
                </Text>

                {/* Subtitle */}
                {goal.subtitle && (
                  <Text fontSize="xs" color="text.muted" lineClamp={1}>
                    {goal.subtitle}
                  </Text>
                )}

                {/* Tags */}
                {goal.tags.length > 0 && (
                  <HStack gap={1} flexWrap="wrap">
                    {goal.tags.slice(0, 2).map((tag) => (
                      <Badge
                        key={tag}
                        bg="bg.active"
                        color="text.secondary"
                        px={2}
                        py={0.5}
                        borderRadius="md"
                        fontSize="9px"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </HStack>
                )}
              </VStack>
            </Box>
          ))}
        </HStack>
      )}
    </Box>
  );
};
