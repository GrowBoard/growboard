import { Card, Box, Text } from '@chakra-ui/react';

/**
 * Component definition for the dashboard home component.
 * @returns The dashboard home component.
 */
function DashboardHome() {
  return (
    <Box p={4}>
      <Card.Root
        bg="bg.card"
        borderColor="border.subtle"
        border="1px solid"
        shadow="lg"
        p={5}
      >
        <Card.Body gap={2} p={0}>
          <Card.Title color="text.primary" fontSize="xl" fontWeight="semibold">
            Card Title
          </Card.Title>
          <Text color="text.secondary">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            necessitatibus incidunt ut officiis explicabo inventore.
          </Text>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}

// Export the dashboard home component.
export default DashboardHome;
