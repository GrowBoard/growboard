import { InputGroup, InputLeftElement, Input, Text } from '@chakra-ui/react';

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
    <InputGroup w={'100%'}>
      <InputLeftElement
        width={'20%'}
        backgroundColor={'blue.200'}
        borderLeftRadius={5}
        border={'1px solid rgba(0, 0, 0, 0.3)'}
        pointerEvents="none"
        borderRightColor={'transparent'}
        pl={2}
        children={
          <Text
            w={'100%'}
            fontSize={'md'}
            fontWeight={'semibold'}
            bg={'blue.200'}
            textAlign={'start'}
          >
            {text}
          </Text>
        }
      />
      <Input
        defaultChecked
        value={value}
        type="date"
        textAlign={'center'}
        size="md"
        w={'100%'}
        variant="outline"
        max={maxValue}
        onChange={(e) => setValue(e.target.value)}
      />
    </InputGroup>
  );
};

export default DateInput;
