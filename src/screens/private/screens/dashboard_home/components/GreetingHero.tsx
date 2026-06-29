import { Box, Text, VStack } from '@chakra-ui/react';
import { GreetingHeroProps } from '../types';
import { getGreeting, getDailyQuote, getFormattedDate } from '../util';

/**
 * GreetingHero component.
 * Renders the top hero strip featuring a time-aware greeting, current date,
 * and a daily rotating motivational quote.
 */
export const GreetingHero = ({ name }: GreetingHeroProps) => {
  const greeting = getGreeting(name);
  const quote = getDailyQuote();
  const formattedDate = getFormattedDate();

  return (
    <Box
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
