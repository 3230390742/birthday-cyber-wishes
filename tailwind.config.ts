import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#070816',
        ink: '#0b1024',
        neonBlue: '#22d3ee',
        neonViolet: '#a855f7',
        warm: '#ffd166',
        candy: '#ff5ea8',
      },
      boxShadow: {
        neon: '0 0 24px rgba(34, 211, 238, 0.45), 0 0 64px rgba(168, 85, 247, 0.22)',
        warm: '0 0 28px rgba(255, 209, 102, 0.35)',
      },
      fontFamily: {
        display: ['Inter', 'Microsoft YaHei', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
