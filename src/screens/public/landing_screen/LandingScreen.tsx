import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  VStack,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { appStore } from '@store';
import { GrowboardIcon } from '@assets';
import {
  LuArrowRight,
  LuShieldCheck,
  LuDatabase,
  LuZap,
  LuFolderGit2,
  LuWallet,
  LuCalendarDays,
  LuCompass,
  LuCode,
  LuBookOpen,
  LuTarget,
  LuChevronDown,
  LuLock,
  LuEyeOff,
  LuHardDrive,
  LuServerOff,
  LuRefreshCw,
  LuCircleCheck,
} from 'react-icons/lu';

/* ═══════════════════════════════════════════════════════════════════════ */
/*  CSS ANIMATIONS                                                        */
/* ═══════════════════════════════════════════════════════════════════════ */
const LANDING_CSS = `
  /* ── Mesh drifts ────────────────────────────────────── */
  @keyframes ld-mesh-a {
    0%   { transform: translate(0, 0) scale(1); }
    33%  { transform: translate(45px, -60px) scale(1.08); }
    66%  { transform: translate(-30px, 40px) scale(0.95); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes ld-mesh-b {
    0%   { transform: translate(0, 0) scale(1); }
    40%  { transform: translate(-55px, 45px) scale(1.05); }
    80%  { transform: translate(35px, -35px) scale(0.97); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes ld-mesh-c {
    0%   { transform: translate(0, 0) scale(1.02); }
    50%  { transform: translate(40px, 55px) scale(0.96); }
    100% { transform: translate(0, 0) scale(1.02); }
  }
  @keyframes ld-noise {
    0%   { opacity: 0.025; }
    50%  { opacity: 0.045; }
    100% { opacity: 0.025; }
  }
  @keyframes ld-shimmer {
    0%   { opacity: 0; transform: translateX(-100%); }
    50%  { opacity: 1; }
    100% { opacity: 0; transform: translateX(100%); }
  }

  /* ── Entrance (above-fold, non-scroll) ──────────────── */
  @keyframes ld-hero-up {
    from { opacity: 0; transform: translateY(36px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ld-card-up {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes ld-slide-left {
    from { opacity: 0; transform: translateX(30px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes ld-pulse-ring {
    0%   { transform: scale(1); opacity: 0.5; }
    100% { transform: scale(2.2); opacity: 0; }
  }

  /* ── Scroll-reveal base class ───────────────────────── */
  .ld-reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .ld-reveal.ld-visible {
    opacity: 1;
    transform: translateY(0);
  }
  .ld-reveal-left {
    opacity: 0;
    transform: translateX(-40px);
    transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .ld-reveal-left.ld-visible {
    opacity: 1;
    transform: translateX(0);
  }
  .ld-reveal-right {
    opacity: 0;
    transform: translateX(40px);
    transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .ld-reveal-right.ld-visible {
    opacity: 1;
    transform: translateX(0);
  }
  .ld-reveal-scale {
    opacity: 0;
    transform: scale(0.92);
    transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
                transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .ld-reveal-scale.ld-visible {
    opacity: 1;
    transform: scale(1);
  }

  @media (prefers-reduced-motion: reduce) {
    .ld-reveal, .ld-reveal-left, .ld-reveal-right, .ld-reveal-scale {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
  }
`;

/* ═══════════════════════════════════════════════════════════════════════ */
/*  SCROLL REVEAL HOOK (IntersectionObserver)                             */
/* ═══════════════════════════════════════════════════════════════════════ */
function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('ld-visible');
            // Once revealed, stop observing (one-shot reveal)
            observerRef.current?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );

    // Observe all reveal elements inside our container
    const container = containerRef.current;
    if (container) {
      const targets = container.querySelectorAll(
        '.ld-reveal, .ld-reveal-left, .ld-reveal-right, .ld-reveal-scale',
      );
      targets.forEach((el) => observerRef.current?.observe(el));
    }

    return () => observerRef.current?.disconnect();
  }, []);

  return containerRef;
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  STARFIELD CANVAS                                                      */
/* ═══════════════════════════════════════════════════════════════════════ */
interface Star { x: number; y: number; r: number; o: number; s: number; d: number; }
function mkStar(w: number, h: number): Star {
  return {
    x: Math.random() * w, y: Math.random() * h,
    r: Math.random() * 0.9 + 0.3, o: Math.random() * 0.35 + 0.05,
    s: Math.random() * 0.002 + 0.001, d: Math.random() > 0.5 ? 1 : -1,
  };
}
const StarCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    let stars: Star[] = [];
    const resize = () => {
      c.width = window.innerWidth; c.height = window.innerHeight;
      stars = Array.from({ length: 50 }, () => mkStar(c.width, c.height));
    };
    resize(); window.addEventListener('resize', resize);
    let raf = 0;
    const tick = () => {
      if (!document.hidden) {
        ctx.clearRect(0, 0, c.width, c.height);
        for (const s of stars) {
          s.o += s.s * s.d;
          if (s.o > 0.5 || s.o < 0.04) s.d *= -1;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,220,255,${s.o.toFixed(3)})`; ctx.fill();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
};

/* ═══════════════════════════════════════════════════════════════════════ */
/*  DATA                                                                  */
/* ═══════════════════════════════════════════════════════════════════════ */

/* ── Console preview modules ──────────────────────────────────────────── */
const MODULES = [
  { id: 'creds',     label: 'Credentials',  icon: LuShieldCheck,  accent: 'rgba(79,70,229,0.7)',  rows: [{ k: 'STRIPE_KEY', v: 'sk_live_51N…' }, { k: 'DB_URL', v: 'postgres://…' }, { k: 'AWS_SECRET', v: 'wJalrXUtnFE…' }] },
  { id: 'expenses',  label: 'Expenses',     icon: LuWallet,       accent: 'rgba(14,165,233,0.7)', rows: [{ k: 'Rent & Utils', v: '₹18,500' }, { k: 'Software Subs', v: '₹3,200' }, { k: 'Travel', v: '₹4,800' }] },
  { id: 'plans',     label: 'Plans',        icon: LuCalendarDays, accent: 'rgba(139,92,246,0.7)', rows: [{ k: 'Sprint Review', v: '30 Jun 14:00' }, { k: 'Cloud Sync', v: '02 Jul 10:30' }, { k: 'Q3 Launch', v: '15 Jul 09:00' }] },
  { id: 'goals',     label: 'Goals',        icon: LuTarget,       accent: 'rgba(16,185,129,0.7)', rows: [{ k: 'Clean TS codebase', v: '85%' }, { k: 'Optimize LCP', v: 'Pending' }, { k: 'Supabase RLS', v: 'Done ✓' }] },
  { id: 'learnings', label: 'Learnings',    icon: LuBookOpen,     accent: 'rgba(236,72,153,0.7)', rows: [{ k: 'TanStack Forms', v: 'Validators' }, { k: 'Chakra v3', v: 'Theme Tokens' }, { k: 'Row Level Sec.', v: 'Supabase' }] },
  { id: 'resources', label: 'Resources',    icon: LuDatabase,     accent: 'rgba(245,158,11,0.7)', rows: [{ k: 'Chakra UI Docs', v: 'chakra-ui.com' }, { k: 'React Hook Form', v: 'rhf.com' }, { k: 'Drive Assets', v: 'Google Drive' }] },
] as const;

/* ── Security & Privacy highlights ────────────────────────────────────── */
const SECURITY_POINTS = [
  { icon: LuEyeOff,    title: 'Zero Data Collection',     desc: 'GrowBoard collects absolutely no user data. No analytics, no tracking pixels, no telemetry. Your usage is invisible to us.' },
  { icon: LuLock,      title: 'No Backend Servers',        desc: 'There is no GrowBoard server. Your data never leaves your browser and your Google Drive. We literally can\'t see it.' },
  { icon: LuHardDrive, title: 'Your Drive, Your Rules',    desc: 'All data is stored as Google Sheets in your personal Google Drive. You own it, you control it, you can delete it anytime.' },
  { icon: LuServerOff, title: 'No Third-Party Sharing',    desc: 'We share nothing with anyone. No APIs phone home, no cookies track sessions, no CDNs log requests. Period.' },
];

/* ── Google Drive architecture points ─────────────────────────────────── */
const GDRIVE_STEPS = [
  { num: '01', title: 'Authenticate with Google',    desc: 'Sign in once with your Google account. GrowBoard uses OAuth 2.0 — your password is never shared with us.' },
  { num: '02', title: 'Data Stored as Sheets',       desc: 'Every module (credentials, plans, expenses) maps to a Google Sheet in your Drive. Human-readable, exportable, yours.' },
  { num: '03', title: 'Offline-First Caching',       desc: 'Zustand persists your workspace locally. Work offline, and changes sync back to Drive when you reconnect.' },
  { num: '04', title: 'Full Portability',             desc: 'Leaving GrowBoard? Your data is already in Google Sheets. No vendor lock-in, no export needed.' },
];

/* ── Feature cards ────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: LuZap,        title: 'Offline-First Speed',   desc: 'Instant responsiveness with local Zustand state caching. Zero loading spinners on refresh.', accent: 'rgba(14,165,233,0.6)' },
  { icon: LuFolderGit2, title: 'Google Drive Sync',     desc: 'Your data stays in your personal Google Drive. Full spreadsheet integration for absolute control.', accent: 'rgba(79,70,229,0.6)' },
  { icon: LuCompass,    title: 'Stream Deck Widgets',   desc: 'Modular productivity cards for credentials, expenses, plans, goals & learnings — tailored to you.', accent: 'rgba(139,92,246,0.6)' },
  { icon: LuShieldCheck, title: 'Privacy by Design',    desc: 'No servers, no tracking, no data collection. Your workspace exists only in your browser and your Drive.', accent: 'rgba(16,185,129,0.6)' },
  { icon: LuRefreshCw,  title: 'Seamless Sync',         desc: 'Changes propagate bidirectionally between local cache and Google Sheets. Conflict-free, automatic.', accent: 'rgba(245,158,11,0.6)' },
  { icon: LuCode,       title: 'Developer Ergonomics',  desc: 'Built with React, Chakra UI, Zustand, and TypeScript. Clean architecture, fully typed, easy to extend.', accent: 'rgba(236,72,153,0.6)' },
];

/* ═══════════════════════════════════════════════════════════════════════ */
/*  SECTION DIVIDER                                                       */
/* ═══════════════════════════════════════════════════════════════════════ */
const SectionDivider = () => (
  <Box maxW="1200px" mx="auto" px={6}>
    <Box h="1px" w="100%"
      style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)' }}
    />
  </Box>
);

/* ═══════════════════════════════════════════════════════════════════════ */
/*  LANDING SCREEN COMPONENT                                              */
/* ═══════════════════════════════════════════════════════════════════════ */
export const LandingScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = appStore((state) => state.Auth.token);
  const isLoggedIn = token !== '' && token !== null;
  const [active, setActive] = useState(0);
  const mouseRef = useRef<HTMLDivElement>(null);
  const scrollRef = useScrollReveal();

  const handleCTA = useCallback(() => navigate(isLoggedIn ? '/dashboard' : '/login'), [isLoggedIn, navigate]);

  // Mouse-following spotlight
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseRef.current?.style.setProperty('--mx', `${e.clientX}px`);
      mouseRef.current?.style.setProperty('--my', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  // Inject CSS once
  useEffect(() => {
    const id = 'ld-css';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id; el.textContent = LANDING_CSS;
      document.head.appendChild(el);
    }
    return () => { document.getElementById('ld-css')?.remove(); };
  }, []);

  const mod = MODULES[active];

  // Merge refs (mouse spotlight + scroll reveal need the same root container)
  const setRefs = useCallback((node: HTMLDivElement | null) => {
    (mouseRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
  }, [scrollRef]);

  return (
    <Box ref={setRefs} bg="#07090e" minH="100vh" position="relative" overflow="hidden">

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* BACKGROUND LAYERS                                             */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <Box position="fixed" inset={0} pointerEvents="none" zIndex={0}>
        <Box position="absolute" inset={0} bg="#0b0e14" />
        <Box position="absolute" top="-20%" right="-15%" w="65vw" h="65vw" borderRadius="full"
          style={{ background: 'radial-gradient(circle at center, rgba(79,70,229,0.18) 0%, rgba(55,48,163,0.08) 40%, transparent 70%)', filter: 'blur(80px)', animation: 'ld-mesh-a 45s ease-in-out infinite', willChange: 'transform' }} />
        <Box position="absolute" bottom="-25%" left="-20%" w="70vw" h="70vw" borderRadius="full"
          style={{ background: 'radial-gradient(circle at center, rgba(14,165,233,0.14) 0%, rgba(2,132,199,0.06) 40%, transparent 70%)', filter: 'blur(90px)', animation: 'ld-mesh-b 55s ease-in-out infinite', willChange: 'transform' }} />
        <Box position="absolute" top="5%" left="-10%" w="45vw" h="45vw" borderRadius="full"
          style={{ background: 'radial-gradient(circle at center, rgba(139,92,246,0.12) 0%, transparent 65%)', filter: 'blur(70px)', animation: 'ld-mesh-c 38s ease-in-out infinite', willChange: 'transform' }} />
        <Box position="absolute" inset={0}
          style={{ background: 'radial-gradient(circle 600px at var(--mx, 50vw) var(--my, 50vh), rgba(99,102,241,0.1), transparent 80%)' }} />
        <Box position="absolute" inset={0}
          style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.05) 1px, transparent 1px)', backgroundSize: '52px 52px', animation: 'ld-noise 8s ease-in-out infinite' }} />
        <StarCanvas />
        <Box position="absolute" left={0} right={0} top="35%" h="1px" overflow="hidden" style={{ opacity: 0.25 }}>
          <Box position="absolute" top={0} left={0} w="30%" h="100%"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(148,163,184,0.5) 50%, transparent 100%)', animation: 'ld-shimmer 14s ease-in-out infinite', animationDelay: '2s' }} />
        </Box>
        <Box position="absolute" left={0} right={0} top="68%" h="1px" overflow="hidden" style={{ opacity: 0.18 }}>
          <Box position="absolute" top={0} left={0} w="20%" h="100%"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(148,163,184,0.4) 50%, transparent 100%)', animation: 'ld-shimmer 18s ease-in-out infinite', animationDelay: '6s' }} />
        </Box>
        <Box position="absolute" inset={0}
          style={{ background: 'radial-gradient(ellipse 80% 80% at center, transparent 40%, rgba(4,5,9,0.45) 100%)' }} />
      </Box>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* STICKY HEADER                                                 */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <Box position="sticky" top={0} zIndex={100}
        borderBottom="1px solid" borderColor="rgba(255,255,255,0.05)"
        bg="rgba(7,9,14,0.7)" backdropFilter="blur(24px) saturate(1.4)">
        <Flex maxW="1200px" mx="auto" px={6} py={4} align="center" justify="space-between">
          <HStack gap={3}>
            <GrowboardIcon width="32px" height="32px" />
            <Text fontWeight="extrabold" fontSize="lg" color="white" letterSpacing="tight">
              {t('Landing.title', 'GrowBoard')}
            </Text>
          </HStack>
          <HStack gap={3}>
            <Button variant="ghost" size="sm" color="rgba(255,255,255,0.45)" fontWeight="semibold"
              _hover={{ color: 'white', bg: 'rgba(255,255,255,0.05)' }}
              onClick={() => document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' })}>
              Security
            </Button>
            <Button variant="ghost" size="sm" color="rgba(255,255,255,0.45)" fontWeight="semibold"
              _hover={{ color: 'white', bg: 'rgba(255,255,255,0.05)' }}
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Features
            </Button>
            <Button size="sm" px={5} fontWeight="bold" color="white"
              bg="rgba(255,255,255,0.06)" border="1px solid" borderColor="rgba(255,255,255,0.08)"
              borderRadius="lg"
              _hover={{ bg: 'rgba(255,255,255,0.1)', borderColor: 'rgba(99,102,241,0.4)', boxShadow: '0 4px 20px rgba(99,102,241,0.15)', transform: 'translateY(-1px)' }}
              _active={{ transform: 'translateY(0)' }}
              transition="all 0.3s cubic-bezier(0.25,0.8,0.25,1)"
              onClick={handleCTA}>
              {isLoggedIn ? t('Landing.goConsole', 'Go to Console') : t('Landing.login', 'Login')}
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT                                                  */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <Box position="relative" zIndex={10}>

        {/* ────────────────────────────────────────────────────────── */}
        {/* HERO SECTION                                               */}
        {/* ────────────────────────────────────────────────────────── */}
        <Flex maxW="1200px" mx="auto" px={6} pt={{ base: 16, md: 24 }} pb={{ base: 12, md: 20 }}
          direction={{ base: 'column', lg: 'row' }} gap={{ base: 14, lg: 20 }} align="center">

          {/* Left — copy */}
          <VStack flex="1.2" align={{ base: 'center', lg: 'flex-start' }} gap={6}
            textAlign={{ base: 'center', lg: 'left' }}
            style={{ animation: 'ld-hero-up 0.9s cubic-bezier(0.22,1,0.36,1) both' }}>

            {/* Trust pills */}
            <HStack gap={3} wrap="wrap" justify={{ base: 'center', lg: 'flex-start' }}>
              <HStack px={3} py={1} borderRadius="full"
                border="1px solid" borderColor="rgba(79,70,229,0.25)" bg="rgba(79,70,229,0.08)">
                <Box w="6px" h="6px" borderRadius="full" bg="rgba(79,70,229,0.9)" position="relative">
                  <Box position="absolute" inset={0} borderRadius="full" bg="rgba(79,70,229,0.6)"
                    style={{ animation: 'ld-pulse-ring 2s ease-out infinite' }} />
                </Box>
                <Text fontSize="xs" fontWeight="bold" color="rgba(255,255,255,0.5)" letterSpacing="wider" textTransform="uppercase">
                  v0.5.3 — Beta
                </Text>
              </HStack>
              <HStack px={3} py={1} borderRadius="full"
                border="1px solid" borderColor="rgba(16,185,129,0.25)" bg="rgba(16,185,129,0.08)">
                <LuShieldCheck size={12} color="rgba(16,185,129,0.9)" />
                <Text fontSize="xs" fontWeight="bold" color="rgba(255,255,255,0.5)" letterSpacing="wider" textTransform="uppercase">
                  Zero Data Collection
                </Text>
              </HStack>
            </HStack>

            <Text fontSize={{ base: '3xl', md: '5xl', lg: '5xl' }} fontWeight="extrabold" lineHeight="1.1"
              letterSpacing="tight" color="white">
              {t('Landing.heroTitle', 'Your Data. Your Drive. Your Rules.')}
            </Text>

            <Text fontSize={{ base: 'md', md: 'lg' }} color="rgba(255,255,255,0.4)" lineHeight="1.7" maxW="xl">
              {t('Landing.heroTagline', 'A Google Drive-first productivity workspace. No servers. No tracking. No data leaves your browser. Your credentials, plans, expenses, and goals live as Google Sheets in your personal Drive — fully portable, fully yours.')}
            </Text>

            <HStack gap={4} mt={2} wrap="wrap" justify={{ base: 'center', lg: 'flex-start' }}>
              <Button size="lg" px={8} fontWeight="bold" color="white"
                bg="rgba(255,255,255,0.04)" border="1px solid" borderColor="rgba(255,255,255,0.1)" borderRadius="xl"
                _hover={{ bg: 'rgba(255,255,255,0.08)', borderColor: 'rgba(99,102,241,0.5)', boxShadow: '0 8px 32px rgba(99,102,241,0.2), 0 0 0 1px rgba(99,102,241,0.15) inset', transform: 'translateY(-2px)' }}
                _active={{ transform: 'translateY(0)' }}
                transition="all 0.3s cubic-bezier(0.25,0.8,0.25,1)"
                onClick={handleCTA}>
                <HStack gap={2}>
                  <Text>{isLoggedIn ? t('Landing.goConsole', 'Go to Console') : t('Landing.getStarted', 'Get Started')}</Text>
                  <LuArrowRight size={16} />
                </HStack>
              </Button>
              <Button variant="ghost" size="lg" px={6} fontWeight="semibold"
                color="rgba(255,255,255,0.35)" _hover={{ color: 'rgba(255,255,255,0.6)' }}
                onClick={() => document.getElementById('security')?.scrollIntoView({ behavior: 'smooth' })}>
                <HStack gap={1}>
                  <Text>{t('Landing.exploreDocs', 'Explore')}</Text>
                  <LuChevronDown size={16} />
                </HStack>
              </Button>
            </HStack>
          </VStack>

          {/* Right — interactive terminal */}
          <Box flex="1" w="100%" maxW="520px"
            style={{ animation: 'ld-slide-left 1s 0.15s cubic-bezier(0.22,1,0.36,1) both' }}>
            <Box
              bg="rgba(12,14,18,0.55)" backdropFilter="blur(32px) saturate(1.4)"
              border="1px solid" borderColor="rgba(255,255,255,0.06)" borderRadius="2xl"
              boxShadow="0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,70,229,0.05) inset, 0 1px 0 rgba(255,255,255,0.03) inset"
              overflow="hidden"
              _hover={{ borderColor: 'rgba(99,102,241,0.2)', boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.12) inset' }}
              transition="all 0.5s cubic-bezier(0.25,0.8,0.25,1)">
              {/* Title bar */}
              <Flex px={5} py={3.5} align="center" justify="space-between"
                borderBottom="1px solid" borderColor="rgba(255,255,255,0.04)" bg="rgba(8,10,14,0.4)">
                <HStack gap={2}>
                  <Box w="10px" h="10px" borderRadius="full" bg="rgba(255,96,92,0.8)" />
                  <Box w="10px" h="10px" borderRadius="full" bg="rgba(255,189,46,0.8)" />
                  <Box w="10px" h="10px" borderRadius="full" bg="rgba(39,201,63,0.8)" />
                </HStack>
                <Text fontSize="10px" fontWeight="bold" color="rgba(255,255,255,0.2)" letterSpacing="widest" textTransform="uppercase">
                  GrowBoard Console
                </Text>
                <Box w="40px" />
              </Flex>
              {/* Tabs */}
              <Flex px={4} pt={3} pb={1} gap={1} overflowX="auto"
                css={{ '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
                {MODULES.map((m, i) => {
                  const Icon = m.icon; const isActive = i === active;
                  return (
                    <Box key={m.id} as="button" px={3} py={2} borderRadius="lg"
                      display="flex" alignItems="center" gap={1.5}
                      bg={isActive ? 'rgba(255,255,255,0.06)' : 'transparent'}
                      border="1px solid" borderColor={isActive ? 'rgba(255,255,255,0.08)' : 'transparent'}
                      onClick={() => setActive(i)} onMouseEnter={() => setActive(i)}
                      transition="all 0.2s" _hover={{ bg: 'rgba(255,255,255,0.04)' }} flexShrink={0}>
                      <Box color={isActive ? 'white' : 'rgba(255,255,255,0.25)'} transition="color 0.2s">
                        <Icon size={14} />
                      </Box>
                      <Text fontSize="11px" fontWeight="bold"
                        color={isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)'}
                        transition="color 0.2s">{m.label}</Text>
                    </Box>
                  );
                })}
              </Flex>
              {/* Content */}
              <Box px={5} py={4}>
                <Box w="100%" h="2px" borderRadius="full" mb={4}
                  style={{ background: `linear-gradient(90deg, ${mod.accent}, transparent)` }} />
                <VStack align="stretch" gap={2}>
                  {mod.rows.map((row, i) => (
                    <Flex key={i} justify="space-between" align="center"
                      px={3.5} py={2.5} borderRadius="lg"
                      bg="rgba(255,255,255,0.02)" border="1px solid" borderColor="rgba(255,255,255,0.04)"
                      _hover={{ bg: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.07)' }}
                      transition="all 0.2s"
                      style={{ animation: `ld-card-up 0.4s ${0.05 * i}s cubic-bezier(0.22,1,0.36,1) both` }}>
                      <Text fontSize="11px" fontFamily="'Space Mono', monospace" color="rgba(255,255,255,0.4)" fontWeight="bold">{row.k}</Text>
                      <Text fontSize="11px" fontFamily="'Space Mono', monospace" color="rgba(255,255,255,0.7)">{row.v}</Text>
                    </Flex>
                  ))}
                </VStack>
                <Flex mt={4} justify="space-between" align="center">
                  <HStack gap={1.5}>
                    <Box w="6px" h="6px" borderRadius="full" bg="rgba(39,201,63,0.7)" />
                    <Text fontSize="10px" color="rgba(255,255,255,0.2)" fontWeight="bold">Connected</Text>
                  </HStack>
                  <Text fontSize="10px" color="rgba(255,255,255,0.15)" fontFamily="'Space Mono', monospace">
                    {mod.rows.length} entries
                  </Text>
                </Flex>
              </Box>
            </Box>
          </Box>
        </Flex>

        <SectionDivider />

        {/* ────────────────────────────────────────────────────────── */}
        {/* SECTION 2 — SECURITY & PRIVACY (scroll-reveal)             */}
        {/* ────────────────────────────────────────────────────────── */}
        <Box id="security" maxW="1200px" mx="auto" px={6} py={{ base: 16, md: 24 }}>

          {/* Section header */}
          <VStack gap={3} mb={16} textAlign="center" className="ld-reveal">
            <HStack px={3} py={1} borderRadius="full"
              border="1px solid" borderColor="rgba(16,185,129,0.25)" bg="rgba(16,185,129,0.06)">
              <LuLock size={12} color="rgba(16,185,129,0.9)" />
              <Text fontSize="xs" fontWeight="bold" color="rgba(16,185,129,0.7)" letterSpacing="widest" textTransform="uppercase">
                Security First
              </Text>
            </HStack>
            <Text fontSize={{ base: 'xl', md: '3xl' }} fontWeight="extrabold" color="white" letterSpacing="tight">
              {"We Don't Want Your Data"}
            </Text>
            <Text fontSize="sm" color="rgba(255,255,255,0.35)" maxW="2xl">
              {"GrowBoard is architecturally incapable of accessing your data. There are no servers, no databases, no analytics."}
              {"Your workspace lives in your browser's local storage and your personal Google Drive — nowhere else."}
            </Text>
          </VStack>

          {/* Security grid */}
          <Flex direction={{ base: 'column', md: 'row' }} gap={5} wrap="wrap">
            {SECURITY_POINTS.map((s, i) => {
              const Icon = s.icon;
              return (
                <Box key={i} flex={{ base: '1 1 100%', md: '1 1 calc(50% - 10px)' }}
                  p={6} borderRadius="xl"
                  bg="rgba(12,14,18,0.4)" backdropFilter="blur(16px)"
                  border="1px solid" borderColor="rgba(16,185,129,0.08)"
                  className="ld-reveal"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                  _hover={{ borderColor: 'rgba(16,185,129,0.25)', transform: 'translateY(-3px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(16,185,129,0.06) inset' }}
                  transition="all 0.35s cubic-bezier(0.25,0.8,0.25,1)">
                  <HStack gap={4} align="flex-start">
                    <Box w={10} h={10} borderRadius="lg" flexShrink={0}
                      bg="rgba(16,185,129,0.1)" display="flex" alignItems="center" justifyContent="center"
                      color="rgba(16,185,129,0.9)">
                      <Icon size={20} />
                    </Box>
                    <VStack align="flex-start" gap={1}>
                      <Text fontSize="md" fontWeight="extrabold" color="white">{s.title}</Text>
                      <Text fontSize="xs" color="rgba(255,255,255,0.35)" lineHeight="1.7">{s.desc}</Text>
                    </VStack>
                  </HStack>
                </Box>
              );
            })}
          </Flex>

          {/* Trust banner */}
          <Box mt={10} p={5} borderRadius="xl"
            border="1px solid" borderColor="rgba(16,185,129,0.12)"
            bg="rgba(16,185,129,0.04)"
            className="ld-reveal-scale"
            style={{ transitionDelay: '0.4s' }}>
            <Flex align="center" justify="center" gap={3} wrap="wrap">
              <LuCircleCheck size={18} color="rgba(16,185,129,0.8)" />
              <Text fontSize="sm" fontWeight="bold" color="rgba(255,255,255,0.5)" textAlign="center">
                No cookies · No analytics · No telemetry · No user data collected or shared — ever
              </Text>
            </Flex>
          </Box>
        </Box>

        <SectionDivider />

        {/* ────────────────────────────────────────────────────────── */}
        {/* SECTION 3 — GOOGLE DRIVE ARCHITECTURE (scroll-reveal)      */}
        {/* ────────────────────────────────────────────────────────── */}
        <Box id="architecture" maxW="1200px" mx="auto" px={6} py={{ base: 16, md: 24 }}>

          <VStack gap={3} mb={16} textAlign="center" className="ld-reveal">
            <HStack px={3} py={1} borderRadius="full"
              border="1px solid" borderColor="rgba(79,70,229,0.25)" bg="rgba(79,70,229,0.06)">
              <LuFolderGit2 size={12} color="rgba(79,70,229,0.9)" />
              <Text fontSize="xs" fontWeight="bold" color="rgba(79,70,229,0.7)" letterSpacing="widest" textTransform="uppercase">
                Google Drive-First
              </Text>
            </HStack>
            <Text fontSize={{ base: 'xl', md: '3xl' }} fontWeight="extrabold" color="white" letterSpacing="tight">
              How It Works
            </Text>
            <Text fontSize="sm" color="rgba(255,255,255,0.35)" maxW="2xl">
              {"GrowBoard is a pure frontend application. All your data is stored as Google Sheets in your personal Drive."}
              {"The browser is the only runtime — there's no backend to hack, no cloud to breach."}
            </Text>
          </VStack>

          {/* Steps */}
          <VStack gap={6} maxW="700px" mx="auto">
            {GDRIVE_STEPS.map((step, i) => (
              <Flex key={i} gap={5} align="flex-start" w="100%"
                className={i % 2 === 0 ? 'ld-reveal-left' : 'ld-reveal-right'}
                style={{ transitionDelay: `${i * 0.12}s` }}>
                {/* Step number */}
                <Box w={12} h={12} borderRadius="xl" flexShrink={0}
                  bg="rgba(79,70,229,0.08)" border="1px solid" borderColor="rgba(79,70,229,0.15)"
                  display="flex" alignItems="center" justifyContent="center">
                  <Text fontSize="sm" fontWeight="extrabold" fontFamily="'Space Mono', monospace"
                    color="rgba(79,70,229,0.9)">{step.num}</Text>
                </Box>
                {/* Step content */}
                <VStack align="flex-start" gap={1} pt={1}>
                  <Text fontSize="md" fontWeight="extrabold" color="white">{step.title}</Text>
                  <Text fontSize="xs" color="rgba(255,255,255,0.35)" lineHeight="1.7">{step.desc}</Text>
                </VStack>
              </Flex>
            ))}
          </VStack>

          {/* Architecture diagram pill */}
          <Box mt={12} className="ld-reveal" style={{ transitionDelay: '0.5s' }}>
            <Flex justify="center">
              <HStack px={5} py={3} borderRadius="xl" gap={4}
                bg="rgba(12,14,18,0.5)" border="1px solid" borderColor="rgba(255,255,255,0.06)">
                <Text fontSize="11px" fontFamily="'Space Mono', monospace" color="rgba(255,255,255,0.3)">
                  Browser (React + Zustand)
                </Text>
                <Text fontSize="11px" color="rgba(79,70,229,0.6)">→</Text>
                <Text fontSize="11px" fontFamily="'Space Mono', monospace" color="rgba(255,255,255,0.3)">
                  Google Sheets API
                </Text>
                <Text fontSize="11px" color="rgba(79,70,229,0.6)">→</Text>
                <Text fontSize="11px" fontFamily="'Space Mono', monospace" color="rgba(255,255,255,0.3)">
                  Your Google Drive
                </Text>
              </HStack>
            </Flex>
          </Box>
        </Box>

        <SectionDivider />

        {/* ────────────────────────────────────────────────────────── */}
        {/* SECTION 4 — FEATURES (scroll-reveal)                       */}
        {/* ────────────────────────────────────────────────────────── */}
        <Box id="features" maxW="1200px" mx="auto" px={6} py={{ base: 16, md: 24 }}>

          <VStack gap={3} mb={14} textAlign="center" className="ld-reveal">
            <Text fontSize="xs" fontWeight="bold" color="rgba(79,70,229,0.7)" letterSpacing="widest" textTransform="uppercase">
              Features
            </Text>
            <Text fontSize={{ base: 'xl', md: '3xl' }} fontWeight="extrabold" color="white" letterSpacing="tight">
              {"Everything You Need, Nothing You Don't"}
            </Text>
            <Text fontSize="sm" color="rgba(255,255,255,0.3)" maxW="lg">
              Every decision optimises for speed, privacy, and ergonomics — no compromises.
            </Text>
          </VStack>

          <Flex wrap="wrap" gap={6} justify="center">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Box key={i} flex={{ base: '1 1 100%', md: '1 1 calc(33.333% - 16px)' }}
                  maxW={{ md: 'calc(33.333% - 16px)' }}
                  p={6} borderRadius="xl"
                  bg="rgba(12,14,18,0.4)" backdropFilter="blur(16px)"
                  border="1px solid" borderColor="rgba(255,255,255,0.05)"
                  className="ld-reveal"
                  style={{ transitionDelay: `${i * 0.08}s` }}
                  _hover={{ borderColor: 'rgba(255,255,255,0.12)', transform: 'translateY(-4px)',
                    boxShadow: `0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px ${f.accent.replace('0.6', '0.08')} inset` }}
                  transition="all 0.35s cubic-bezier(0.25,0.8,0.25,1)">
                  <Box w={10} h={10} borderRadius="lg" mb={4}
                    bg={f.accent.replace('0.6', '0.1')} display="flex" alignItems="center" justifyContent="center"
                    color={f.accent.replace('0.6', '0.9')}>
                    <Icon size={20} />
                  </Box>
                  <Text fontSize="md" fontWeight="extrabold" color="white" mb={2}>{f.title}</Text>
                  <Text fontSize="xs" color="rgba(255,255,255,0.35)" lineHeight="1.7">{f.desc}</Text>
                </Box>
              );
            })}
          </Flex>
        </Box>

        <SectionDivider />

        {/* ────────────────────────────────────────────────────────── */}
        {/* SECTION 5 — FINAL CTA (scroll-reveal)                      */}
        {/* ────────────────────────────────────────────────────────── */}
        <Box maxW="1200px" mx="auto" px={6} py={{ base: 16, md: 24 }}>
          <VStack gap={6} textAlign="center" className="ld-reveal-scale">
            <Text fontSize={{ base: 'xl', md: '3xl' }} fontWeight="extrabold" color="white" letterSpacing="tight">
              Ready to Own Your Workspace?
            </Text>
            <Text fontSize="sm" color="rgba(255,255,255,0.35)" maxW="lg">
              Start organising your projects, credentials, and goals — with zero data
              leaving your browser. Free, private, no sign-up wall.
            </Text>
            <Button size="lg" px={10} mt={2} fontWeight="bold" color="white"
              bg="rgba(255,255,255,0.04)" border="1px solid" borderColor="rgba(255,255,255,0.1)" borderRadius="xl"
              _hover={{ bg: 'rgba(255,255,255,0.08)', borderColor: 'rgba(99,102,241,0.5)', boxShadow: '0 8px 32px rgba(99,102,241,0.2), 0 0 0 1px rgba(99,102,241,0.15) inset', transform: 'translateY(-2px)' }}
              _active={{ transform: 'translateY(0)' }}
              transition="all 0.3s cubic-bezier(0.25,0.8,0.25,1)"
              onClick={handleCTA}>
              <HStack gap={2}>
                <Text>{isLoggedIn ? 'Open Console' : "Get Started — It's Free"}</Text>
                <LuArrowRight size={16} />
              </HStack>
            </Button>
          </VStack>
        </Box>

        {/* ────────────────────────────────────────────────────────── */}
        {/* FOOTER                                                      */}
        {/* ────────────────────────────────────────────────────────── */}
        <Box borderTop="1px solid" borderColor="rgba(255,255,255,0.06)" bg="rgba(7,9,14,0.85)" backdropFilter="blur(16px)">
          <Flex maxW="1200px" mx="auto" px={6} py={6}
            direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" gap={4}>
            <Text fontSize="12px" color="rgba(255,255,255,0.35)">
              {t('Landing.copyright', '© 2026 GrowBoard. All rights reserved.', { year: 2026 })}
            </Text>
            <HStack gap={5}>
              <ChakraLink href="/privacy" fontSize="12px" color="rgba(255,255,255,0.3)" fontWeight="semibold"
                _hover={{ color: 'rgba(255,255,255,0.6)' }} transition="color 0.2s" cursor="pointer"
                onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate('/privacy'); }}>
                Privacy Policy
              </ChakraLink>
              <ChakraLink href="/data-policy" fontSize="12px" color="rgba(255,255,255,0.3)" fontWeight="semibold"
                _hover={{ color: 'rgba(255,255,255,0.6)' }} transition="color 0.2s" cursor="pointer"
                onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate('/data-policy'); }}>
                Data Policy
              </ChakraLink>
              <ChakraLink href="/terms" fontSize="12px" color="rgba(255,255,255,0.3)" fontWeight="semibold"
                _hover={{ color: 'rgba(255,255,255,0.6)' }} transition="color 0.2s" cursor="pointer"
                onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate('/terms'); }}>
                Terms & Conditions
              </ChakraLink>
            </HStack>
            <Text fontSize="11px" color="rgba(255,255,255,0.2)">
              No data collected
            </Text>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingScreen;
