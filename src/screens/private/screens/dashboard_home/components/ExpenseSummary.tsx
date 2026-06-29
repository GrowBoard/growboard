import { useMemo } from 'react';
import { Box, Flex, Text, VStack, HStack, Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useGetExpensesDataForDate } from '@hooks';
import { getExpenseDataSumForCategory } from '@screens/private/screens/expenses/expense_preview/ExpensesTable/utils';
import { EXPENSE_TYPE_COLOR } from '@screens/private/screens/expenses/expense_preview/const';
import { ExpenseType } from '@screens/private/screens/expenses/expense_preview/types';
import { ExpenseSummaryProps } from '../types';

/**
 * ExpenseSummary component.
 * Displays a summary of the current month's expenses including total spend,
 * top spending category, and a visual mini category breakdown bar.
 * Fetches expense data via useGetExpensesDataForDate.
 */
export const ExpenseSummary = (_props: ExpenseSummaryProps) => {
  const navigate = useNavigate();
  const { data: queryResponse, isLoading } = useGetExpensesDataForDate();

  /** Derive totals and category breakdown from query response. */
  const { totalSum, sumByCategory, topCategory } = useMemo(() => {
    if (!queryResponse?.data) {
      return { totalSum: 0, sumByCategory: {} as Record<ExpenseType, number>, topCategory: null };
    }

    const { sumByCategory: sbc, totalSum: ts } = getExpenseDataSumForCategory(
      queryResponse.data,
    );

    // Find category with highest spending
    let topCat: { name: string; amount: number } | null = null;
    (Object.entries(sbc) as [string, number][]).forEach(([cat, amt]) => {
      if (!topCat || amt > topCat.amount) {
        topCat = { name: cat, amount: amt };
      }
    });

    return {
      totalSum: ts,
      sumByCategory: sbc as Record<ExpenseType, number>,
      topCategory: topCat,
    };
  }, [queryResponse]);

  /** Filter categories with non-zero spend for the breakdown bar. */
  const activeCategories = useMemo(() => {
    return (Object.entries(sumByCategory) as [ExpenseType, number][]).filter(
      ([, amt]) => amt > 0,
    );
  }, [sumByCategory]);

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
          💸 This Month&apos;s Expenses
        </Text>
        <Text
          fontSize="sm"
          color="blue.400"
          cursor="pointer"
          _hover={{ textDecoration: 'underline' }}
          onClick={() => navigate('/expenses')}
        >
          View all →
        </Text>
      </Flex>

      {isLoading ? (
        <Flex justify="center" align="center" minH="80px">
          <Spinner size="md" color="blue.500" />
        </Flex>
      ) : (
        <VStack align="stretch" gap={4}>
          {/* Total + Top Category row */}
          <HStack justify="space-between" align="flex-start">
            <VStack align="flex-start" gap={0}>
              <Text fontSize="xs" color="text.muted">
                Total Spend
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="text.primary">
                ₹{totalSum.toLocaleString('en-IN')}
              </Text>
            </VStack>

            {topCategory !== null && (
              <VStack align="flex-end" gap={0}>
                <Text fontSize="xs" color="text.muted">
                  Top Category
                </Text>
                <HStack gap={1.5}>
                  {/* Color swatch using inline style — data-driven visualization color */}
                  <Box
                    w="10px"
                    h="10px"
                    borderRadius="full"
                    flexShrink={0}
                    style={{
                      background:
                        EXPENSE_TYPE_COLOR[
                          (topCategory as { name: string; amount: number }).name as ExpenseType
                        ] ?? '#888',
                    }}
                  />
                  <Text fontSize="sm" fontWeight="semibold" color="text.primary">
                    {(topCategory as { name: string; amount: number }).name}
                  </Text>
                </HStack>
              </VStack>
            )}
          </HStack>

          {/* Mini category breakdown bar */}
          {activeCategories.length > 0 ? (
            <VStack align="stretch" gap={2}>
              <Text fontSize="xs" color="text.muted">
                Category Breakdown
              </Text>
              {/* Proportional segmented bar */}
              <Flex
                h="10px"
                borderRadius="full"
                overflow="hidden"
                gap="2px"
                bg="bg.active"
              >
                {activeCategories.map(([cat, amt]) => (
                  <Box
                    key={cat}
                    h="full"
                    flexShrink={0}
                    title={`${cat}: ₹${amt}`}
                    style={{
                      width: `${(amt / (totalSum || 1)) * 100}%`,
                      background: EXPENSE_TYPE_COLOR[cat] ?? '#888',
                    }}
                  />
                ))}
              </Flex>

              {/* Legend */}
              <Flex gap={3} flexWrap="wrap">
                {activeCategories.map(([cat, amt]) => (
                  <HStack key={cat} gap={1}>
                    <Box
                      w="8px"
                      h="8px"
                      borderRadius="full"
                      flexShrink={0}
                      style={{ background: EXPENSE_TYPE_COLOR[cat] ?? '#888' }}
                    />
                    <Text fontSize="10px" color="text.muted">
                      {cat}
                    </Text>
                    <Text fontSize="10px" color="text.secondary" fontWeight="medium">
                      ₹{amt.toLocaleString('en-IN')}
                    </Text>
                  </HStack>
                ))}
              </Flex>
            </VStack>
          ) : (
            <Text fontSize="sm" color="text.muted" fontStyle="italic">
              No expenses recorded this month.
            </Text>
          )}
        </VStack>
      )}
    </Box>
  );
};
