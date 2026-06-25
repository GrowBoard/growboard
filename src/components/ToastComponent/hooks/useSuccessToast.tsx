import { toaster } from '../toaster';
import { useTranslation } from 'react-i18next';

const useSuccessToast = () => {
  const { t } = useTranslation();

  return (titleKey: string) =>
    toaster.create({
      title: t(titleKey),
      type: 'success',
    });
};

export default useSuccessToast;
