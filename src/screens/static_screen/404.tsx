import { useTranslation } from 'react-i18next';

/**
 * Component definition for the Error404 component.
 *
 * @param props The properties for the component.
 * @returns The Error404 component.
 */
function Error404() {
  const { t } = useTranslation();
  return <div>{t('Static.errorText')}</div>;
}

// Export the Error404 component.
export default Error404;
