import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f9fa',
          100: '#f0f1f3',
          200: '#e1e3e7',
          300: '#d2d5db',
          400: '#b3b8c3',
          500: '#949aaa',
          600: '#757d8f',
          700: '#5a6270',
          800: '#3f4654',
          900: '#242a36',
          950: '#1a1f28',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#cabffd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        'accent-teal': {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#0c2f2a',
        },
        surface: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#ebebeb',
          300: '#d9d9d9',
          400: '#bdbdbd',
          500: '#a0a0a0',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'text-scramble': 'text-scramble 0.5s ease-out',
        float: 'float 3s ease-in-out infinite',
        'draw-line': 'draw-line 1.5s ease-out forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 0%' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(20, 184, 166, 0.7)',
          },
          '50%': {
            boxShadow: '0 0 0 10px rgba(20, 184, 166, 0)',
          },
        },
        'text-scramble': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-8px)',
          },
        },
        'draw-line': {
          '0%': {
            strokeDashoffset: '1',
          },
          '100%': {
            strokeDashoffset: '0',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
