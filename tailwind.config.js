/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe',
          300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1',
          600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81',
        },
        accent: { 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed' },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#0d0d14',
          card: '#f8f8fc',
          'card-dark': '#13131e',
          'soft': '#f1f1f8',
          'soft-dark': '#1a1a28',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-primary': 'radial-gradient(at 40% 20%, hsla(240,100%,74%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(259,100%,77%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(220,100%,77%,0.08) 0px, transparent 50%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      boxShadow: {
        'glass': '0 4px 32px -4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'glass-dark': '0 4px 32px -4px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.2)',
        'glow-primary': '0 0 24px -4px rgba(99,102,241,0.4)',
      },
    },
  },
  plugins: [],
}
