import { useColorMode } from '@chakra-ui/react';

const useColorSelector = () => {
  const { colorMode } = useColorMode();

  return colorMode === 'light'
    ? {
        text: {
          Heading: 'green.500',
          Hero: 'linear(to-b, green.500, blue.500)',
        },
        icon: {
          primary: {
            color: 'green.400',
            bg: 'white',
          },
          secondary: 'green.500',
        },
        bg: {
          container: 'green.200',
        },
        gradient: {
          topAppBar: 'linear(to-r, green.300, blue.500)',
          sideBarBG: 'linear(to-br, green.300, blue.500)',
          contentBG: 'linear(to-r, green.200, blue.400)',
        },
      }
    : {
        text: {
          Heading: 'green.700',
          Hero: 'linear(to-b, green.700, blue.700)',
        },
        icon: {
          primary: {
            color: 'green.700',
            bg: 'white',
          },
          secondary: 'green.700',
        },
        bg: {
          container: 'green.700',
        },
        gradient: {
          topAppBar: 'linear(to-r, green.800, blue.900)',
          sideBarBG: 'linear(to-br, green.800, blue.900)',
          contentBG: 'linear(to-r, green.800, blue.900)',
        },
      };
};

export default useColorSelector;
