import { Box, Flex, Text, HStack, VStack, Badge } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { RecentLearningsProps } from '../types';

/**
 * RecentLearnings component.
 * Renders a vertical list of the most recently updated learning entries
 * with a "View all" shortcut to the Learnings screen.
 */
export const RecentLearnings = ({ learnings }: RecentLearningsProps) => {
  const navigate = useNavigate();

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
          📚 Recent Learnings
        </Text>
        <Text
          fontSize="sm"
          color="blue.400"
          cursor="pointer"
          _hover={{ textDecoration: 'underline' }}
          onClick={() => navigate('/learning')}
        >
          View all →
        </Text>
      </Flex>

      {learnings.length === 0 ? (
        <Text fontSize="sm" color="text.muted" fontStyle="italic">
          No learnings yet. Head to Learnings to create one.
        </Text>
      ) : (
        <VStack align="stretch" gap={3}>
          {learnings.map((item) => (
            <Box
              key={item.title}
              p={4}
              bg="bg.panel"
              border="1px solid"
              borderColor="border.subtle"
              borderRadius="xl"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ borderColor: 'border.focus', bg: 'bg.panel' }}
              onClick={() => navigate('/learning')}
            >
              <Flex justify="space-between" align="flex-start" gap={3}>
                <VStack align="flex-start" gap={1} overflow="hidden" flex={1}>
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color="text.primary"
                    truncate
                    maxW="100%"
                  >
                    {item.title}
                  </Text>
                  {item.subtitle && (
                    <Text fontSize="xs" color="text.muted" truncate maxW="100%">
                      {item.subtitle}
                    </Text>
                  )}
                </VStack>

                {/* Tags */}
                {item.tags.length > 0 && (
                  <HStack gap={1} flexShrink={0} display={{ base: 'none', sm: 'flex' }}>
                    {item.tags.slice(0, 2).map((tag) => (
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
              </Flex>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};
