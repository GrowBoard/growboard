import { Input, HStack, Box } from '@chakra-ui/react';

const DateInput = ({
  text,
  value,
  maxValue,
  setValue,
}: {
  text: string;
  value: string;
  maxValue: string;
  setValue: (value: string) => void;
}) => {
  return (
    <HStack w="100%" gap={0}>
      <Box
        w="25%"
        bg="blue.200"
        color="blue.900"
        py="7px"
        px={3}
        borderLeftRadius="md"
        border="1px solid"
        borderColor="gray.600"
        borderRight="none"
        fontSize="sm"
        fontWeight="semibold"
        textAlign="center"
      >
        {text}
      </Box>
      <Input
        flex={1}
        borderRightRadius="md"
        borderLeftRadius="none"
        border="1px solid"
        borderColor="gray.600"
        bg="gray.800"
        color="white"
        type="date"
        textAlign="center"
        value={value}
        max={maxValue}
        onChange={(e) => setValue(e.target.value)}
      />
    </HStack>
  );
};

export default DateInput;
