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
        color={'black'}
        fontSize="lg"
        fontWeight="semibold"
      >
        {t('LandingIntro.title')}
      </Text>
    </Box>
  );
};

export default TemplatePointers;
