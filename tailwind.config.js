/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        journal: ['Kalam', 'cursive'],
      },
      colors: {
        paper: '#FFF9C4',
        ink: '#C0392B',
        'ink-light': '#E74C3C',
        'ink-dark': '#922B21',
      },
      animation: {
        'seal-pulse': 'sealPulse 0.6s ease-in-out',
        'fade-in': 'fadeIn 0.4s ease-in',
      },
      keyframes: {
        sealPulse: {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.15)' },
          '60%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
