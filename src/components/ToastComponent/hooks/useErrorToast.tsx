import { toaster } from '../toaster';
import { useTranslation } from 'react-i18next';

const useErrorToast = () => {
  const { t } = useTranslation();

  return (titleKey: string) =>
    toaster.create({
      title: t(titleKey),
      type: 'error',
    });
};

export default useErrorToast;
