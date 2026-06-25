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
        bg="bg.glass"
        color="text.secondary"
        py="7px"
        px={3}
        borderLeftRadius="md"
        border="1px solid"
        borderColor="border.subtle"
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
        borderColor="border.subtle"
        bg="bg.panel"
        color="text.primary"
        type="date"
        textAlign="center"
        value={value}
        max={maxValue}
        _focus={{
          borderColor: 'border.focus',
          boxShadow: '0 0 0 1px var(--chakra-colors-border-focus)',
        }}
        onChange={(e) => setValue(e.target.value)}
      />
    </HStack>
  );
};

export default DateInput;
