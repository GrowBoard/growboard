import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { GrowboardIcon } from '@assets';
import { LuArrowLeft } from 'react-icons/lu';

/**
 * Properties for the LegalPageLayout component.
 */
interface LegalPageLayoutProps {
  /** The title of the policy or legal document. */
  title: string;
  /** The last updated date string. */
  lastUpdated: string;
  /** The child elements containing the document content. */
  children: React.ReactNode;
}

/**
 * Shared layout for all legal/policy pages.
 * Provides consistent theme-compatible header, back navigation, and content container.
 *
 * @param props Component properties.
 * @returns React component.
 */
const LegalPageLayout = ({ title, lastUpdated, children }: LegalPageLayoutProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Box bg="bg.app" minH="100vh" color="text.primary">
      {/* Header */}
      <Box borderBottom="1px solid" borderColor="border.subtle"
        bg="bg.glass" backdropFilter="blur(24px) saturate(1.4)">
        <Flex maxW="860px" mx="auto" px={6} py={4} align="center" justify="space-between">
          <HStack gap={3}>
            <GrowboardIcon width="28px" height="28px" />
            <Text fontWeight="extrabold" fontSize="md" color="text.primary" letterSpacing="tight"
              cursor="pointer" onClick={() => navigate('/')}>
              {t('StaticScreen.legalLayout.brand')}
            </Text>
          </HStack>
          <Button variant="ghost" size="sm" color="text.secondary" fontWeight="semibold"
            _hover={{ color: 'text.primary', bg: 'bg.active' }}
            onClick={() => navigate(-1)}>
            <HStack gap={1}>
              <LuArrowLeft size={14} />
              <Text>{t('StaticScreen.legalLayout.back')}</Text>
            </HStack>
          </Button>
        </Flex>
      </Box>

      {/* Content */}
      <Box maxW="860px" mx="auto" px={6} py={{ base: 10, md: 16 }}>
        <VStack align="flex-start" gap={3} mb={10}>
          <Text as="h1" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="extrabold" letterSpacing="tight">
            {title}
          </Text>
          <Text fontSize="xs" color="text.muted" fontWeight="semibold">
            {t('StaticScreen.legalLayout.lastUpdated', { date: lastUpdated })}
          </Text>
        </VStack>

        <VStack align="flex-start" gap={8}
          css={{
            '& h2': {
              fontSize: '18px',
              fontWeight: 800,
              color: 'var(--chakra-colors-text-primary)',
              marginBottom: '8px',
            },
            '& p': {
              fontSize: '14px',
              lineHeight: 1.8,
              color: 'var(--chakra-colors-text-secondary)',
            },
            '& ul': {
              paddingLeft: '20px',
              marginTop: '8px',
            },
            '& li': {
              fontSize: '14px',
              lineHeight: 1.8,
              color: 'var(--chakra-colors-text-secondary)',
              marginBottom: '4px',
            },
          }}>
          {children}
        </VStack>
      </Box>

      {/* Footer */}
      <Box borderTop="1px solid" borderColor="border.subtle" bg="bg.glass">
        <Flex maxW="860px" mx="auto" px={6} py={5} justify="center">
          <Text fontSize="11px" color="text.muted">
            {t('StaticScreen.legalLayout.copyright', { year: new Date().getFullYear() })}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default LegalPageLayout;
