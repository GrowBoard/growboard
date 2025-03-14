import { useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const useErrorToast = () => {
  const { t } = useTranslation();
  const toast = useToast();

  return (titleKey: string) =>
    toast({
      title: t(titleKey),
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
};

export default useErrorToast;
