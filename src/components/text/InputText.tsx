import { useState, useEffect } from 'react';
import { InputTextProps, InputType } from './types';
import { Input, Text, Box } from '@chakra-ui/react';
import { PasswordEye } from './components';

/**
 * InputText Component.
 * Renders a standardized text/password/date input box using Chakra UI elements.
 *
 * @param props Component properties containing labels, defaults, update callbacks, and state.
 * @returns The InputText component.
 */
export const InputText = (props: InputTextProps) => {
  const [value, setValue] = useState(props.defaultValue);

  useEffect(() => {
    setValue(props.defaultValue);
  }, [props.defaultValue]);

  /**
   * Handler invoked when the input value changes.
   * Updates local state and propagates change back to parent form.
   *
   * @param val The new input string value.
   */
  const updateInputValue = (val: string) => {
    setValue(val);
    props.updateFormValue({ updateType: props.updateType, value: val });
  };

  const [inputType, setInputType] = useState<InputType>(
    props.type || InputType.TEXT,
  );

  /**
   * Toggles the visibility of password inputs between password and text modes.
   */
  const handleVisibility = () => {
    if (inputType === InputType.PASSWORD) {
      setInputType(InputType.TEXT);
    } else {
      setInputType(InputType.PASSWORD);
    }
  };

  return (
    <Box w="100%" mb={2}>
      <Text fontSize="sm" px={1} mb={1} color="gray.300">
        {props.labelTitle}
      </Text>
      <Box position="relative" w="100%">
        <Input
          disabled={props.disabled}
          borderColor={props.errorState ? 'red.500' : 'gray.600'}
          bgColor={'gray.800'}
          color="white"
          type={inputType || 'text'}
          value={value}
          placeholder={props.placeholder || ''}
          onChange={(e) => updateInputValue(e.target.value)}
          pl={4}
          pr={props.type === InputType.PASSWORD ? '10' : '4'}
          _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
        />
        {props.type === InputType.PASSWORD && (
          <Box
            position="absolute"
            right="3"
            top="50%"
            transform="translateY(-50%)"
            zIndex="2"
            cursor="pointer"
            onClick={handleVisibility}
            color="gray.400"
            _hover={{ color: 'gray.200' }}
          >
            <PasswordEye inputType={inputType} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default InputText;
