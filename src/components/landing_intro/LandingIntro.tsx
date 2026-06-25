import { Center, Box, VStack, Text } from '@chakra-ui/react';
import { GrowboardIcon } from '@assets';
import TemplatePointers from './TemplatePointer';

/**
 * LandingIntro component
 *
 * @returns The LandingIntro component.
 */
const LandingIntro = () => {
  return (
    <Center h="100%" py={6}>
      <Box
        maxW="md"
        textAlign="center"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <VStack gap={2} mb={6} align="center">
          <GrowboardIcon width="80px" height="80px" />
          <Text fontWeight="extrabold" fontSize="3xl" color="white">
            Growboard
          </Text>
        </VStack>
        {/*  pointers component */}
        <TemplatePointers />
      </Box>
    </Center>
  );
};

export default LandingIntro;
