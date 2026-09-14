/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50:  '#FFF4F8',
          100: '#FFE8F2',
          200: '#FFD6E8',
          300: '#FFB6C1',
          400: '#FF85A2',
          500: '#FF69B4',
          600: '#FF4D9D',
          700: '#E0357F',
          800: '#B82266',
          900: '#8F1450',
        },
        cream: {
          50:  '#FFFDF9',
          100: '#FFF8EF',
          200: '#FFF0D6',
          300: '#FFEAA7',
          400: '#FFE082',
          500: '#FFD54F',
        },
        mint: {
          100: '#DFF9FB',
          200: '#B2EBF2',
          300: '#80DEEA',
        },
        lavender: {
          100: '#F3E5F5',
          200: '#E1BEE7',
          300: '#CE93D8',
        },
      },
      fontFamily: {
        heading: ['"Pacifico"', 'cursive'],
        display: ['"Dancing Script"', 'cursive'],
        body: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'pastel-gradient': 'linear-gradient(135deg, #FFF4F8 0%, #FFE8F2 25%, #FFF0D6 50%, #DFF9FB 75%, #F3E5F5 100%)',
        'love-gradient': 'linear-gradient(135deg, #FFB6C1 0%, #FF85A2 50%, #FF69B4 100%)',
        'soft-gradient': 'linear-gradient(180deg, #FFF4F8 0%, #FFE8F2 100%)',
        'night-gradient': 'linear-gradient(180deg, #0a0020 0%, #1a0040 50%, #2d0060 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'float-fast': 'float 2s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'heart-beat': 'heartbeat 1.2s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'spin-slow': 'spin 8s linear infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.3, transform: 'scale(0.7)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        twinkle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.2, transform: 'scale(0.5)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(255, 105, 180, 0.15)',
        'glass-lg': '0 16px 48px rgba(255, 105, 180, 0.2)',
        'soft': '0 4px 20px rgba(255, 182, 193, 0.3)',
        'soft-lg': '0 8px 40px rgba(255, 182, 193, 0.4)',
        'glow': '0 0 20px rgba(255, 105, 180, 0.4)',
        'glow-lg': '0 0 40px rgba(255, 105, 180, 0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
