import { LoginPageIllustration } from '@assets';
import { Box, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const TemplatePointers = () => {
  const { t } = useTranslation();
  return (
    <Box>
      <LoginPageIllustration />
      <Text
        className=" text-center w-full"
        color={'gray.300'}
        fontSize="lg"
        fontWeight="semibold"
        mt={4}
      >
        {t('LandingIntro.title')}
      </Text>
    </Box>
  );
};

export default TemplatePointers;
