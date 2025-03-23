import { EditIcon, DeleteIcon } from '@assets';
import { IconButton, VStack } from '@chakra-ui/react';

const EditDelete = ({ expenseId }: { expenseId: string }) => {
  return (
    <VStack
      alignItems={'end'}
      justifyContent={'center'}
      w={'100%'}
      spacing={1}
      h={'100%'}
    >
      <IconButton
        aria-label=""
        size={'xs'}
        variant={'outline'}
        colorScheme="cyan"
        mx={1}
        icon={<EditIcon />}
      />
      <IconButton
        aria-label=""
        size={'xs'}
        variant={'outline'}
        colorScheme="red"
        mx={1}
        icon={<DeleteIcon />}
      />
    </VStack>
  );
};

export default EditDelete;
