import { Center, Spinner } from '@chakra-ui/react';
import { PageLoadingComponentProps } from './types';

/**
 * Page loading component.
 *
 * @param props  The page loading component props.
 * @returns The page loading component.
 */
const PageLoadingComponent = (props: PageLoadingComponentProps) => {
  return (
    <Center h="100%" w="100%">
      <Spinner size="xl" color="blue.500" />
    </Center>
  );
};

export default PageLoadingComponent;
