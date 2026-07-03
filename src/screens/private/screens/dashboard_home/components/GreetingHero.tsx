import { Box, Text, VStack, Button, HStack, Spinner } from '@chakra-ui/react';
import { LuCircleHelp, LuRefreshCw } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { GreetingHeroProps } from '../types';
import { getGreeting, getDailyQuote, getFormattedDate } from '../util';

/**
 * GreetingHero component.
 * Renders the top hero strip featuring a time-aware greeting, current date,
 * and a daily rotating motivational quote.
 */
export const GreetingHero = ({
  name,
  onStartTour,
  onSync,
  isSyncing,
}: GreetingHeroProps) => {
  const { t } = useTranslation();
  const greeting = getGreeting(name);
  const quote = getDailyQuote();
  const formattedDate = getFormattedDate();

  return (
    <Box
      className="tour-greeting-hero"
      w="full"
      p={8}
      borderRadius="2xl"
      bg="gradient.topAppBar"
      border="1px solid"
      borderColor="border.subtle"
      shadow="lg"
      position="relative"
      overflow="hidden"
    >
      <HStack position="absolute" top={6} right={6} gap={2} zIndex={1}>
        {onSync && (
          <Button
            size="xs"
            variant="outline"
            onClick={onSync}
            borderColor="border.subtle"
            bg="rgba(0, 216, 255, 0.1)"
            color="text.onGradient"
            _hover={{
              bg: 'rgba(0, 216, 255, 0.25)',
              borderColor: 'border.focus',
            }}
            gap={1.5}
            px={2.5}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <Spinner size="xs" color="currentColor" />
            ) : (
              <LuRefreshCw />
            )}
            {isSyncing ? 'Syncing...' : 'Sync'}
          </Button>
        )}
        {onStartTour && (
          <Button
            size="xs"
            variant="outline"
            onClick={onStartTour}
            borderColor="border.subtle"
            bg="rgba(0, 216, 255, 0.1)"
            color="text.onGradient"
            _hover={{
              bg: 'rgba(0, 216, 255, 0.25)',
              borderColor: 'border.focus',
            }}
            gap={1.5}
            px={2.5}
          >
            <LuCircleHelp />
            {t('DashboardTour.startTour')}
          </Button>
        )}
      </HStack>
      {/* Decorative blurred orb */}
      <Box
        position="absolute"
        top="-40px"
        right="-40px"
        w="200px"
        h="200px"
        borderRadius="full"
        bg="bg.active"
        opacity={0.3}
        filter="blur(60px)"
        pointerEvents="none"
      />

      <VStack align="flex-start" gap={1}>
        <Text
          fontSize="xs"
          fontWeight="medium"
          color="text.onGradient"
          opacity={0.75}
          letterSpacing="wider"
          textTransform="uppercase"
        >
          {formattedDate}
        </Text>

        <Text
          fontSize={{ base: '2xl', md: '3xl' }}
          fontWeight="bold"
          color="text.onGradient"
          lineHeight="shorter"
        >
          {greeting} 👋
        </Text>

        <Text
          fontSize="sm"
          color="text.onGradient"
          opacity={0.8}
          fontStyle="italic"
          mt={1}
        >
          &ldquo;{quote}&rdquo;
        </Text>
      </VStack>
    </Box>
  );
};
