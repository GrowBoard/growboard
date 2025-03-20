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
        borderRight={'1px'}
        pointerEvents="none"
        children={
          <Text width={20} fontSize={'sm'} textAlign={'center'}>
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
