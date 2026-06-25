import { Card, Box, Text } from '@chakra-ui/react';

/**
 * Component definition for the dashboard home component.
 * @returns The dashboard home component.
 */
function DashboardHome() {
  return (
    <Box p={4}>
      <Card.Root
        bg="gray.850"
        borderColor="gray.700"
        border="1px solid"
        shadow="lg"
        p={5}
      >
        <Card.Body gap={2} p={0}>
          <Card.Title color="white" fontSize="xl" fontWeight="semibold">
            Card Title
          </Card.Title>
          <Text color="gray.300">
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
