import { AddIcon } from '@assets';
import { IconButton } from '@chakra-ui/react';

const AddExpenseButton = () => {
  return (
    <IconButton
      aria-label=""
      size={'xs'}
      variant={'outline'}
      colorScheme="cyan"
      mx={1}
      icon={<AddIcon />}
    />
  );
};

export default AddExpenseButton;
