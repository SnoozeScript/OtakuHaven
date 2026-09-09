/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep-space app base
        ink: {
          950: '#04060d',
          900: '#080b16',
          800: '#0e1322',
          700: '#161c30',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 24px -8px rgba(34, 211, 238, 0.35)',
        glow: '0 0 48px -12px rgba(34, 211, 238, 0.45)',
        'glow-violet': '0 0 48px -12px rgba(129, 140, 248, 0.45)',
        card: '0 16px 40px -16px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'shimmer': 'shimmer 1.8s linear infinite',
        'aurora-a': 'aurora-a 22s ease-in-out infinite alternate',
        'aurora-b': 'aurora-b 28s ease-in-out infinite alternate',
        'aurora-c': 'aurora-c 25s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'aurora-a': {
          '0%': { transform: 'translate(-12%, -8%) scale(1)' },
          '100%': { transform: 'translate(10%, 12%) scale(1.25)' },
        },
        'aurora-b': {
          '0%': { transform: 'translate(10%, 4%) scale(1.15)' },
          '100%': { transform: 'translate(-14%, -6%) scale(0.95)' },
        },
        'aurora-c': {
          '0%': { transform: 'translate(0%, 10%) scale(1)' },
          '100%': { transform: 'translate(-6%, -12%) scale(1.3)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'brand': 'linear-gradient(135deg, #22d3ee 0%, #6366f1 55%, #a855f7 100%)',
        'brand-soft': 'linear-gradient(135deg, rgba(34,211,238,0.16) 0%, rgba(99,102,241,0.16) 55%, rgba(168,85,247,0.16) 100%)',
      },
    },
  },
}
