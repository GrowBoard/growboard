import { LoginPageIllustration } from '@assets';
import { useTranslation } from 'react-i18next';

const TemplatePointers = () => {
  const { t } = useTranslation();
  return (
    <div>
      <LoginPageIllustration />
      <div className=" text-center w-full">{t('LandingIntro.title')}</div>
    </div>
  );
};

export default TemplatePointers;
