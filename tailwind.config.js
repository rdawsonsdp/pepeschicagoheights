/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Pepe's Mexican Restaurant Brand Colors
        cream: '#D4782F',
        'pepe-dark': '#1C1C1C',
        'pepe-red': '#C8102E',
        'pepe-green': '#006847',
        'pepe-gold': '#E8A317',
        'pepe-teal': '#2D6B5A',
        'pepe-charcoal': '#2D2926',
        'pepe-cream': '#D4782F',
        'success-green': '#4CAF50',
        'error-red': '#E53935',
        'muted': '#8B7355',
        'dark': '#1C1C1C',
      },
      fontFamily: {
        heading: ['var(--font-bevan)', 'Bevan', 'cursive'],
        oswald: ['var(--font-bevan)', 'Bevan', 'cursive'],
        display: ['var(--font-bevan)', 'Bevan', 'cursive'],
        body: ['var(--font-lato)', 'Lato', 'sans-serif'],
        lato: ['var(--font-lato)', 'Lato', 'sans-serif'],
        crimson: ['var(--font-crimson)', 'Crimson Text', 'serif'],
        merriweather: ['var(--font-merriweather)', 'Merriweather', 'serif'],
        dish: ['var(--font-roboto-condensed)', 'Roboto Condensed', 'sans-serif'],
        'roboto-condensed': ['var(--font-roboto-condensed)', 'Roboto Condensed', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.6s ease-out forwards',
        'float': 'float 5s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(2deg)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
