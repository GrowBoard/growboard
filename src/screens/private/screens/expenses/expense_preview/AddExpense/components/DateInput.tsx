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
        bg="bg.input"
        color="text.secondary"
        p={'9px'}
        borderLeftRadius="md"
        border="1px solid"
        borderColor="border.input"
        borderRight="none"
        fontSize="sm"
        fontWeight="semibold"
        textAlign="center"
      >
        {text}
      </Box>
      <Input
        flex={1}
        px={2}
        borderRightRadius="md"
        borderLeftRadius="none"
        border="1px solid"
        borderColor="border.input"
        bg="bg.input"
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
