import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neural: {
          cyan: '#22d3ee',
          violet: '#a78bfa',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 24px -4px rgba(34, 211, 238, 0.45)',
        'glow-violet': '0 0 24px -4px rgba(167, 139, 250, 0.45)',
        'glow-dual':
          '0 0 32px -6px rgba(34, 211, 238, 0.35), 0 0 32px -6px rgba(167, 139, 250, 0.35)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -8px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'gradient-neural': 'linear-gradient(135deg, #22d3ee 0%, #a78bfa 100%)',
        'grid-industrial':
          'linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '32px 32px',
      },
      spacing: {
        '13': '3.25rem',
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        scan: 'scan 8s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
