import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { LuInbox } from 'react-icons/lu';

interface EmptyStateProps {
  title: string;
  description?: string;
  /** Optional label for the primary action button */
  buttonText?: string;
  /** Called when the primary button is clicked */
  onButtonClick?: () => void;
  /** Convenience alias for the add/create action (maps to onButtonClick) */
  onAdd?: () => void;
}

/**
 * EmptyState component.
 * Displays a centered placeholder with a title, optional description,
 * and an optional call-to-action button when a list or section has no data.
 */
export const EmptyState = ({
  title,
  description,
  buttonText = 'Add',
  onButtonClick,
  onAdd,
}: EmptyStateProps) => {
  const handleClick = onButtonClick ?? onAdd;

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      w="full"
      h="full"
      minH="240px"
      py={12}
    >
      <VStack gap={4} textAlign="center" px={4}>
        <Box
          bg="bg.cardHeader"
          border="1px solid"
          borderColor="border.subtle"
          borderRadius="full"
          p={5}
          color="text.muted"
        >
          <LuInbox size={36} />
        </Box>
        <VStack gap={1}>
          <Text fontSize="lg" fontWeight="semibold" color="text.primary">
            {title}
          </Text>
          {description && (
            <Text fontSize="sm" color="text.secondary">
              {description}
            </Text>
          )}
        </VStack>
        {handleClick && (
          <Button
            size="sm"
            colorPalette="cyan"
            variant="subtle"
            onClick={handleClick}
            px={6}
          >
            {buttonText}
          </Button>
        )}
      </VStack>
    </Box>
  );
};
