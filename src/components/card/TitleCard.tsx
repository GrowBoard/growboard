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
    <Card.Root
      width="100%"
      p={6}
      variant="elevated"
      bg="bg.card"
      borderColor="border.subtle"
      border="1px solid"
      mt={props.topMargin || 6}
    >
      <Flex justify="space-between" align="center" width="100%">
        <Card.Title fontSize="xl" fontWeight="semibold" color="text.primary">
          {props.title}
        </Card.Title>
        {props.TopSideButtons && <Box>{props.TopSideButtons}</Box>}
      </Flex>

      <Separator mt={2} mb={4} borderColor="border.subtle" />

      <Card.Body p={0} height="100%" width="100%">
        {props.children}
      </Card.Body>
    </Card.Root>
  );
};

export default TitleCard;
