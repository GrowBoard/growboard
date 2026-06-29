import { Badge, Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import { DialogContainer } from '@components';
import { useTranslation } from 'react-i18next';
import { LearningPreviewDialogProps } from '../types';
import { renderMarkdown } from '../util';

/**
 * LearningPreviewDialog renders a modal containing the fully rendered markdown content
 * of a learning item, complete with title, subtitle, and badges.
 */
export const LearningPreviewDialog = ({
  isOpen,
  onOpenChange,
  item,
}: LearningPreviewDialogProps) => {
  const { t } = useTranslation();

  if (!item) return null;

  return (
    <DialogContainer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={item.title}
      maxW="6xl"
      footer={
        <HStack justify="flex-end" w="full">
          <Button
            variant="ghost"
            onClick={() => onOpenChange({ open: false })}
            color="text.secondary"
            borderRadius="lg"
            px={5}
            _hover={{ bg: 'bg.active' }}
          >
            {t('Learnings.cancel', 'Close')}
          </Button>
        </HStack>
      }
    >
      <VStack align="stretch" gap={4} py={2}>
        {item.subtitle && (
          <Text fontSize="sm" color="text.muted" fontStyle="italic">
            {item.subtitle}
          </Text>
        )}

        {item.tags.length > 0 && (
          <HStack wrap="wrap" gap={1.5}>
            {item.tags.map((tag) => (
              <Badge
                key={tag}
                bg="bg.active"
                color="text.secondary"
                px={2.5}
                py={0.5}
                borderRadius="md"
                fontSize="10px"
                fontWeight="medium"
                border="1px solid"
                borderColor="border.subtle"
              >
                {tag}
              </Badge>
            ))}
          </HStack>
        )}

        <Box
          mt={2}
          p={4}
          bg="bg.card"
          border="1px solid"
          borderColor="border.subtle"
          borderRadius="lg"
          maxH="450px"
          overflowY="auto"
        >
          {renderMarkdown(item.content)}
        </Box>
      </VStack>
    </DialogContainer>
  );
};

export default LearningPreviewDialog;
