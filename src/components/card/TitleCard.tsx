import { TitleCardProps } from './types';
import { Card, Separator, Flex, Box } from '@chakra-ui/react';

/**
 * Title card component.
 *
 * @param props The title card props.
 * @returns The title card component.
 */
const TitleCard = (props: TitleCardProps) => {
  return (
    <Card.Root width="100%" p={6} variant="elevated" bg="gray.850" borderColor="gray.700" border="1px solid" mt={props.topMargin || 6}>
      <Flex justify="space-between" align="center" width="100%">
        <Card.Title fontSize="xl" fontWeight="semibold" color="white">
          {props.title}
        </Card.Title>
        {props.TopSideButtons && (
          <Box>{props.TopSideButtons}</Box>
        )}
      </Flex>

      <Separator mt={2} mb={4} borderColor="gray.600" />

      <Card.Body p={0} height="100%" width="100%">
        {props.children}
      </Card.Body>
    </Card.Root>
  );
};

export default TitleCard;
