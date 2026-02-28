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
        cream: '#FFFFFF',
        'pepe-dark': '#1A1A1A',
        'pepe-red': '#00bfff',
        'pepe-green': '#006847',
        'pepe-gold': '#F0960E',
        'pepe-orange': '#E88A00',
        'pepe-teal': '#2D6B5A',
        'pepe-charcoal': '#333333',
        'pepe-cream': '#FFFFFF',
        'pepe-burnt-orange': '#D4782F',
        'pepe-terracotta': '#CC5500',
        'pepe-warm-white': '#F8F8F8',
        'pepe-sand': '#E0E0E0',
        'pepe-maroon': '#8B2318',
        'success-green': '#4CAF50',
        'error-red': '#E53935',
        'muted': '#888888',
        'dark': '#1A1A1A',
        // Semantic aliases for component usage
        'primary-brown': '#1A1A1A',
        'charcoal': '#333333',
        'light-brown': '#333333',
        'accent-gold': '#F0960E',
        // Button state tokens
        'pepe-red-hover': '#00a6d6',
        'pepe-red-active': '#008db8',
        'pepe-dark-active': '#111111',
        // Dine-in menu cream
        'pepe-menu-cream': '#FFFFFF',
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
