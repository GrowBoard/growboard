import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import LegalPageLayout from './LegalPageLayout';

/**
 * Privacy Policy screen component.
 * Describes how GrowBoard handles user data.
 *
 * @returns React component.
 */
const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <LegalPageLayout
      title={t('StaticScreen.privacyPolicy.title')}
      lastUpdated="29 June 2026"
    >
      <Box>
        <h2>{t('StaticScreen.privacyPolicy.introTitle')}</h2>
        <p>{t('StaticScreen.privacyPolicy.introText')}</p>
      </Box>

      <Box>
        <h2>{t('StaticScreen.privacyPolicy.noDataTitle')}</h2>
        <p>{t('StaticScreen.privacyPolicy.noDataText')}</p>
      </Box>

      <Box>
        <h2>{t('StaticScreen.privacyPolicy.noBackendTitle')}</h2>
        <p>{t('StaticScreen.privacyPolicy.noBackendText')}</p>
        <ul>
          <li>{t('StaticScreen.privacyPolicy.noBackendList1')}</li>
          <li>{t('StaticScreen.privacyPolicy.noBackendList2')}</li>
        </ul>
      </Box>

      <Box>
        <h2>{t('StaticScreen.privacyPolicy.googleOAuthTitle')}</h2>
        <p>{t('StaticScreen.privacyPolicy.googleOAuthText')}</p>
      </Box>

      <Box>
        <h2>{t('StaticScreen.privacyPolicy.googleDriveTitle')}</h2>
        <p>{t('StaticScreen.privacyPolicy.googleDriveText')}</p>
      </Box>

      <Box>
        <h2>{t('StaticScreen.privacyPolicy.thirdPartyTitle')}</h2>
        <p>{t('StaticScreen.privacyPolicy.thirdPartyText')}</p>
      </Box>

      <Box>
        <h2>{t('StaticScreen.privacyPolicy.changesTitle')}</h2>
        <p>{t('StaticScreen.privacyPolicy.changesText')}</p>
      </Box>

      <Box>
        <h2>{t('StaticScreen.privacyPolicy.contactTitle')}</h2>
        <p>{t('StaticScreen.privacyPolicy.contactText')}</p>
      </Box>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;
