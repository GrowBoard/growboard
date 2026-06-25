import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

// ─── Styles ───────────────────────────────────────────────────────────────────

const ANIMATION_CSS = `
  @keyframes gb-mesh-drift-a {
    0%   { transform: translate(0,   0)   scale(1);    }
    33%  { transform: translate(40px, -55px) scale(1.08); }
    66%  { transform: translate(-25px, 35px) scale(0.95); }
    100% { transform: translate(0,   0)   scale(1);    }
  }
  @keyframes gb-mesh-drift-b {
    0%   { transform: translate(0, 0)    scale(1);    }
    40%  { transform: translate(-50px, 40px)  scale(1.05); }
    80%  { transform: translate(30px, -30px) scale(0.97); }
    100% { transform: translate(0, 0)    scale(1);    }
  }
  @keyframes gb-mesh-drift-c {
    0%   { transform: translate(0, 0)    scale(1.02); }
    50%  { transform: translate(35px, 50px)  scale(0.96); }
    100% { transform: translate(0, 0)    scale(1.02); }
  }
  @keyframes gb-noise-slow {
    0%   { opacity: 0.028; }
    50%  { opacity: 0.042; }
    100% { opacity: 0.028; }
  }
  @keyframes gb-shimmer {
    0%   { opacity: 0; transform: translateX(-100%); }
    50%  { opacity: 1; }
    100% { opacity: 0; transform: translateX(100%); }
  }
`;

// ─── Tiny star-field canvas ───────────────────────────────────────────────────
// Very slow, very sparse — barely perceptible depth layer.

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  dir: number;
}

function makeStar(w: number, h: number): Star {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    radius: Math.random() * 0.9 + 0.3,
    opacity: Math.random() * 0.4 + 0.05,
    speed: Math.random() * 0.002 + 0.001,
    dir: Math.random() > 0.5 ? 1 : -1,
  };
}

const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<Star[]>([]);
  const raf = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars.current = Array.from({ length: 55 }, () =>
        makeStar(canvas.width, canvas.height),
      );
    };
    resize();
    window.addEventListener('resize', resize);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars.current) {
        s.opacity += s.speed * s.dir;
        if (s.opacity > 0.55 || s.opacity < 0.04) s.dir *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${s.opacity.toFixed(3)})`;
        ctx.fill();
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const AnimatedBackground = () => {
  useEffect(() => {
    const id = 'gb-bg-css';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = ANIMATION_CSS;
      document.head.appendChild(el);
    }
    return () => document.getElementById('gb-bg-css')?.remove();
  }, []);

  return (
    <Box position="absolute" inset={0} overflow="hidden" pointerEvents="none">
      {/* 1 ── Deep navy base */}
      <Box position="absolute" inset={0} bg="#07090e" />

      {/* 2 ── Primary glow — indigo, top-right */}
      <Box
        position="absolute"
        top="-20%"
        right="-15%"
        w="65vw"
        h="65vw"
        borderRadius="full"
        style={{
          background:
            'radial-gradient(circle at center, rgba(79,70,229,0.13) 0%, rgba(55,48,163,0.07) 40%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'gb-mesh-drift-a 45s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* 3 ── Secondary glow — sky-blue, bottom-left */}
      <Box
        position="absolute"
        bottom="-25%"
        left="-20%"
        w="70vw"
        h="70vw"
        borderRadius="full"
        style={{
          background:
            'radial-gradient(circle at center, rgba(14,165,233,0.09) 0%, rgba(2,132,199,0.05) 40%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'gb-mesh-drift-b 55s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* 4 ── Tertiary accent — violet, upper-left */}
      <Box
        position="absolute"
        top="5%"
        left="-10%"
        w="45vw"
        h="45vw"
        borderRadius="full"
        style={{
          background:
            'radial-gradient(circle at center, rgba(139,92,246,0.08) 0%, transparent 65%)',
          filter: 'blur(70px)',
          animation: 'gb-mesh-drift-c 38s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* 5 ── Subtle dot matrix (very faint) */}
      <Box
        position="absolute"
        inset={0}
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(148,163,184,0.08) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          animation: 'gb-noise-slow 8s ease-in-out infinite',
        }}
      />

      {/* 6 ── Star field (depth layer) */}
      <Box position="absolute" inset={0}>
        <StarField />
      </Box>

      {/* 7 ── Horizontal shimmer line — very subtle, slow */}
      <Box
        position="absolute"
        left="0"
        right="0"
        top="40%"
        h="1px"
        overflow="hidden"
        style={{ opacity: 0.3 }}
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          w="30%"
          h="100%"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(148,163,184,0.5) 50%, transparent 100%)',
            animation: 'gb-shimmer 14s ease-in-out infinite',
            animationDelay: '3s',
          }}
        />
      </Box>

      {/* 8 ── Bottom shimmer line */}
      <Box
        position="absolute"
        left="0"
        right="0"
        top="62%"
        h="1px"
        overflow="hidden"
        style={{ opacity: 0.2 }}
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          w="20%"
          h="100%"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(148,163,184,0.4) 50%, transparent 100%)',
            animation: 'gb-shimmer 18s ease-in-out infinite',
            animationDelay: '7s',
          }}
        />
      </Box>

      {/* 9 ── Radial vignette — darkens edges, focuses center */}
      <Box
        position="absolute"
        inset={0}
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at center, transparent 30%, rgba(4,5,9,0.75) 100%)',
        }}
      />

      {/* 10 ── Top gradient fade (navbar feel) */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="120px"
        style={{
          background:
            'linear-gradient(to bottom, rgba(7,9,14,0.6) 0%, transparent 100%)',
        }}
      />
    </Box>
  );
};

export default AnimatedBackground;
