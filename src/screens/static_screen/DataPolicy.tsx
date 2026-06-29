import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import LegalPageLayout from './LegalPageLayout';

/**
 * Data Policy screen component.
 * Explains GrowBoard's data architecture and storage model.
 *
 * @returns React component.
 */
const DataPolicy = () => {
  const { t } = useTranslation();

  return (
    <LegalPageLayout title={t('StaticScreen.dataPolicy.title')} lastUpdated="29 June 2026">
      <Box>
        <h2>{t('StaticScreen.dataPolicy.overviewTitle')}</h2>
        <p>{t('StaticScreen.dataPolicy.overviewText')}</p>
      </Box>

      <Box>
        <h2>{t('StaticScreen.dataPolicy.storageTitle')}</h2>
        <p>{t('StaticScreen.dataPolicy.storageText')}</p>
        <ul>
          <li>
            <Box as="strong" color="text.primary">
              {t('StaticScreen.dataPolicy.storageList1Title')}
            </Box>
            {t('StaticScreen.dataPolicy.storageList1Text')}
          </li>
          <li>
            <Box as="strong" color="text.primary">
              {t('StaticScreen.dataPolicy.storageList2Title')}
            </Box>
            {t('StaticScreen.dataPolicy.storageList2Text')}
          </li>
        </ul>
      </Box>

      <Box>
        <h2>{t('StaticScreen.dataPolicy.flowTitle')}</h2>
        <p>{t('StaticScreen.dataPolicy.flowText')}</p>
        <ul>
          <li>{t('StaticScreen.dataPolicy.flowList1')}</li>
          <li>{t('StaticScreen.dataPolicy.flowList2')}</li>
          <li>{t('StaticScreen.dataPolicy.flowList3')}</li>
          <li>{t('StaticScreen.dataPolicy.flowList4')}</li>
        </ul>
      </Box>

      <Box>
        <h2>{t('StaticScreen.dataPolicy.ownershipTitle')}</h2>
        <p>{t('StaticScreen.dataPolicy.ownershipText')}</p>
        <ul>
          <li>{t('StaticScreen.dataPolicy.ownershipList1')}</li>
          <li>{t('StaticScreen.dataPolicy.ownershipList2')}</li>
          <li>{t('StaticScreen.dataPolicy.ownershipList3')}</li>
          <li>{t('StaticScreen.dataPolicy.ownershipList4')}</li>
        </ul>
      </Box>

      <Box>
        <h2>{t('StaticScreen.dataPolicy.encryptionTitle')}</h2>
        <p>{t('StaticScreen.dataPolicy.encryptionText')}</p>
      </Box>

      <Box>
        <h2>{t('StaticScreen.dataPolicy.retentionTitle')}</h2>
        <p>{t('StaticScreen.dataPolicy.retentionText')}</p>
      </Box>

      <Box>
        <h2>{t('StaticScreen.dataPolicy.sharingTitle')}</h2>
        <p>{t('StaticScreen.dataPolicy.sharingText')}</p>
      </Box>
    </LegalPageLayout>
  );
};

export default DataPolicy;
