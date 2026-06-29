import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  LandingIntro,
  TitleBoxContainer,
  useSuccessToast,
  useErrorToast,
} from '@components';
import { useTranslation } from 'react-i18next';
import { Box, Button, Spinner, Text, VStack } from '@chakra-ui/react';
import { appStore } from '@store';
import { setAuthSelector, useShallow } from '@selectors';
import { useGoogleLogin } from '@react-oauth/google';
import AnimatedBackground from './AnimatedBackground';

// ── Card & panel entry keyframes ──────────────────────────────────────────────
const CARD_ANIMATIONS = `
  @keyframes gb-card-enter {
    from { opacity: 0; transform: translateY(32px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes gb-panel-enter {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes gb-content-enter {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// Google OAuth scopes requested:
//  - openid, profile, email     → identity
//  - spreadsheets               → Google Sheets read/write
//  - documents                  → Google Docs read/write
//  - drive.file                 → Drive files created/opened by this app
const GOOGLE_SCOPES = [
  'openid',
  'profile',
  'email',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/drive.file',
].join(' ');

const GoogleIcon = ({ spinning }: { spinning?: boolean }) =>
  spinning ? (
    <Spinner size="sm" color="white" mr={2} />
  ) : (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginRight: '8px', flexShrink: 0 }}
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

/**
 * Component definition for the login screen.
 * @returns The Login component.
 */
const LoginScreen = () => {
  const { t } = useTranslation();
  const successToast = useSuccessToast();
  const errorToast = useErrorToast();
  const setAuthData = appStore(useShallow(setAuthSelector));
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const tokenParam = searchParams.get('token');
  const nameParam = searchParams.get('name');
  const emailParam = searchParams.get('email');

  // Inject card entry animation CSS once
  useEffect(() => {
    const styleId = 'gb-card-animations';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = CARD_ANIMATIONS;
      document.head.appendChild(style);
    }
    return () => {
      document.getElementById('gb-card-animations')?.remove();
    };
  }, []);

  // Legacy backend redirect callback (kept for backwards compatibility)
  useEffect(() => {
    if (tokenParam && nameParam && emailParam) {
      setAuthData({
        token: tokenParam,
        name: decodeURIComponent(nameParam),
        email: decodeURIComponent(emailParam),
      });
      successToast('Google login successful.');
      setSearchParams({}, { replace: true });
    }
  }, [
    tokenParam,
    nameParam,
    emailParam,
    setAuthData,
    setSearchParams,
    successToast,
  ]);

  // ── Google OAuth (frontend-only via @react-oauth/google) ──────────────────
  const loginWithGoogle = useGoogleLogin({
    scope: GOOGLE_SCOPES,

    onSuccess: async (tokenResponse) => {
      try {
        console.log('Google login raw response:', tokenResponse);
        // Verify that the required scopes were actually granted
        const grantedScopes = tokenResponse.scope
          ? tokenResponse.scope.split(' ')
          : [];
        console.log('Granted Google scopes:', grantedScopes);

        const requiredScopes = [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive.file',
        ];
        const missingScopes = requiredScopes.filter(
          (s) => !grantedScopes.includes(s),
        );

        if (missingScopes.length > 0) {
          console.warn('Missing required Google OAuth scopes:', missingScopes);
          errorToast(
            'Permission Denied: Please check all permission boxes to allow access to Google Drive and Google Sheets.',
          );
          setLoading(false);
          return;
        }

        // Fetch user profile using the access token
        const res = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          },
        );

        if (!res.ok) throw new Error('Failed to fetch Google user info');

        const profile = await res.json();

        // Calculate token expiry timestamp (Google returns expires_in in seconds)
        // We extend local token lifetime to 7 days so silent refreshes can seamlessly re-authorize
        const expiresAt = tokenResponse.expires_in
          ? Date.now() + tokenResponse.expires_in * 1000 * 24 * 7
          : undefined;
        setAuthData({
          token: tokenResponse.access_token,
          name: profile.name ?? '',
          email: profile.email ?? '',
          picture: profile.picture ?? '',
          expiresAt,
        });

        successToast(`Welcome, ${profile.name ?? 'there'}! 👋`);
      } catch {
        errorToast('Failed to retrieve profile. Please try again.');
      } finally {
        setLoading(false);
      }
    },

    onError: (error) => {
      setLoading(false);
      if (error.error !== 'access_denied') {
        errorToast('Google sign-in failed. Please try again.');
      }
    },

    // Prompt user to select/re-consent so scopes are always granted
    prompt: 'consent',

    // Use popup flow (no page redirect needed)
    flow: 'implicit',
  });

  const handleLogin = () => {
    setLoading(true);
    loginWithGoogle();
  };

  return (
    <TitleBoxContainer
      title="Login"
      style={{ backgroundColor: '#07090e' }}
      h={'100vh'}
      w={'100%'}
      alignItems={'center'}
      justifyContent={'center'}
      display={'flex'}
      position="relative"
      overflow="hidden"
    >
      {/* ── Animated background ─────────────────────────────── */}
      <Box position="absolute" inset={0} zIndex={0}>
        <AnimatedBackground />
      </Box>

      {/* ── Glassmorphic card ───────────────────────────────── */}
      <Box
        display="flex"
        flexDirection={{ base: 'column', md: 'row' }}
        height={{ base: 'auto', md: '75vh', lg: '70vh' }}
        maxH={{ base: 'none', md: '650px' }}
        width={{ base: '90%', sm: '80%', md: '80%', lg: '70%', xl: '65%' }}
        maxWidth="1100px"
        bg="rgba(12, 14, 18, 0.55)"
        backdropFilter="blur(32px) saturate(1.4)"
        border="1px solid"
        borderColor="rgba(255, 255, 255, 0.06)"
        borderRadius="2xl"
        boxShadow="0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(79,70,229,0.06) inset, 0 1px 0 rgba(255,255,255,0.04) inset"
        overflow="hidden"
        mx="auto"
        my={{ base: 8, md: 0 }}
        position="relative"
        zIndex={10}
        _hover={{
          borderColor: 'rgba(99, 102, 241, 0.25)',
          boxShadow:
            '0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(99,102,241,0.15) inset, 0 1px 0 rgba(255,255,255,0.08) inset',
        }}
        transition="all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)"
        style={{
          animation: 'gb-card-enter 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
      >
        {/* ── Left panel — branding ─────────────────────────── */}
        <Box
          display={{ base: 'none', md: 'flex' }}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
          width="50%"
          bg="rgba(8, 10, 14, 0.5)"
          borderRight="1px solid"
          borderColor="rgba(255, 255, 255, 0.05)"
          p={8}
          position="relative"
          overflow="hidden"
        >
          {/* Subtle inner glow */}
          <Box
            position="absolute"
            bottom="-20%"
            left="-20%"
            w="80%"
            h="80%"
            borderRadius="full"
            style={{
              background:
                'radial-gradient(circle, rgba(97,61,194,0.14) 0%, transparent 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />
          <Box
            position="relative"
            zIndex={1}
            style={{
              animation:
                'gb-panel-enter 1s 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
            }}
          >
            <LandingIntro />
          </Box>
        </Box>

        {/* ── Right panel — login action ────────────────────── */}
        <VStack
          width={{ base: '100%', md: '50%' }}
          height="100%"
          py={{ base: 12, md: 16 }}
          px={{ base: 6, sm: 8, md: 10 }}
          justifyContent="center"
          alignItems="stretch"
          bg="transparent"
          position="relative"
        >
          {/* Top accent line */}
          <Box
            position="absolute"
            top={0}
            left="10%"
            right="10%"
            h="1px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(79,70,229,0.25), rgba(148,163,184,0.3), rgba(79,70,229,0.25), transparent)',
            }}
          />

          <VStack
            justifyContent="center"
            w="100%"
            h="100%"
            gap={8}
            style={{
              animation:
                'gb-content-enter 0.9s 0.2s cubic-bezier(0.22, 1, 0.36, 1) both',
            }}
          >
            <VStack gap={2} w="100%">
              <Text
                textAlign="center"
                fontSize="2xl"
                fontWeight="extrabold"
                color="white"
                letterSpacing="tight"
              >
                {t('LoginScreen.title')}
              </Text>
              <Text
                textAlign="center"
                fontSize="sm"
                color="rgba(255,255,255,0.35)"
                letterSpacing="wide"
              >
                Sign in to continue
              </Text>
            </VStack>

            <VStack w="100%" gap={4}>
              <Button
                width="100%"
                bg="rgba(255, 255, 255, 0.03)"
                color="white"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.08)"
                fontWeight="semibold"
                size="lg"
                borderRadius="lg"
                transition="all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
                _hover={{
                  bg: 'rgba(255, 255, 255, 0.07)',
                  borderColor: 'rgba(99, 102, 241, 0.45)',
                  boxShadow:
                    '0 8px 32px rgba(99, 102, 241, 0.18), 0 0 0 1px rgba(99, 102, 241, 0.2) inset',
                  transform: 'translateY(-2px)',
                }}
                _active={{
                  bg: 'rgba(255, 255, 255, 0.04)',
                  transform: 'translateY(0)',
                }}
                disabled={loading}
                onClick={handleLogin}
                py={7}
              >
                <GoogleIcon spinning={loading} />
                {loading ? 'Signing in…' : 'Continue with Google'}
              </Button>

              {/* Permission disclosure */}
              <Text
                textAlign="center"
                fontSize="xs"
                color="rgba(255,255,255,0.2)"
                lineHeight="tall"
                px={2}
              >
                By continuing, you grant Growboard access to your Google
                account, including Sheets, Docs, and Drive files.
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </Box>
    </TitleBoxContainer>
  );
};

export default LoginScreen;
