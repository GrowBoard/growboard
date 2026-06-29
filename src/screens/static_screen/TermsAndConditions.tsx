import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import LegalPageLayout from './LegalPageLayout';

/**
 * Terms and Conditions screen component.
 * Defines the terms of use for the GrowBoard application.
 *
 * @returns React component.
 */
const TermsAndConditions = () => {
  const { t } = useTranslation();

  return (
    <LegalPageLayout title={t('StaticScreen.terms.title')} lastUpdated="29 June 2026">
      <Box>
        <h2>{t('StaticScreen.terms.acceptanceTitle')}</h2>
        <p>{t('StaticScreen.terms.acceptanceText')}</p>
      </Box>

      <Box>
        <h2>{t('StaticScreen.terms.serviceTitle')}</h2>
        <p>{t('StaticScreen.terms.serviceText')}</p>
      </Box>

      <Box>
        <h2>{t('StaticScreen.terms.accountTitle')}</h2>
        <p>{t('StaticScreen.terms.accountText')}</p>
      </Box>

      <Box>
        <h2>{t('StaticScreen.terms.responsibilitiesTitle')}</h2>
        <p>{t('StaticScreen.terms.responsibilitiesText')}</p>
        <ul>
          <li>{t('StaticScreen.terms.responsibilitiesList1')}</li>
          <li>{t('StaticScreen.terms.responsibilitiesList2')}</li>
          <li>{t('StaticScreen.terms.responsibilitiesList3')}</li>
          <li>{t('StaticScreen.terms.responsibilitiesList4')}</li>
        </ul>
      </Box>

      <Box>
        <h2>{t('StaticScreen.terms.warrantyTitle')}</h2>
        <p>{t('StaticScreen.terms.warrantyText')}</p>
      </Box>

      <Box>
        <h2>{t('StaticScreen.terms.liabilityTitle')}</h2>
        <p>{t('StaticScreen.terms.liabilityText')}</p>
      </Box>

      <Box>
        <h2>{t('StaticScreen.terms.dataTitle')}</h2>
        <p>{t('StaticScreen.terms.dataText')}</p>
      </Box>

      <Box>
        <h2>{t('StaticScreen.terms.modificationsTitle')}</h2>
        <p>{t('StaticScreen.terms.modificationsText')}</p>
      </Box>

      <Box>
        <h2>{t('StaticScreen.terms.governingTitle')}</h2>
        <p>{t('StaticScreen.terms.governingText')}</p>
      </Box>
    </LegalPageLayout>
  );
};

export default TermsAndConditions;
