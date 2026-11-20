import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: '#00ff41',
        'green-dim': '#00cc33',
        'green-faint': 'rgba(0,255,65,0.08)',
        purple: '#9d4edd',
        cyan: '#00f5ff',
        bg: '#020b02',
        bg2: '#040f04',
        surface: 'rgba(0,255,65,0.04)',
        border: 'rgba(0,255,65,0.18)',
        text: '#c8ffc8',
        'text-dim': '#4a7a4a',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-display)', 'monospace'],
        retro: ['var(--font-retro)', 'monospace'],
      },
      boxShadow: {
        'green-glow': '0 0 8px #00ff41, 0 0 24px rgba(0,255,65,0.4)',
        'green-glow-sm': '0 0 4px #00ff41, 0 0 12px rgba(0,255,65,0.3)',
      },
      animation: {
        'pulse-dot': 'pulse-dot 1.8s infinite',
        'float': 'float 3s ease-in-out infinite',
        'flicker': 'flicker 2s infinite alternate',
        'blink': 'blink 1s step-end infinite',
        'scanlines': 'scanlines 8s linear infinite',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,255,65,0.6)' },
          '50%': { boxShadow: '0 0 0 6px rgba(0,255,65,0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'flicker': {
          '0%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { opacity: '0.2' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'scanlines': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 8px' },
        },
      },
    },
  },
  plugins: [],
};

export default config;