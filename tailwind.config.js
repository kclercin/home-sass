/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-rose': 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 25%, #fbcfe8 50%, #f9a8d4 75%, #ffffff 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      backdropBlur: {
        'xs': '2px',
      },
      colors: {
        'glass': {
          'white': 'rgba(255, 255, 255, 0.25)',
          'white-light': 'rgba(255, 255, 255, 0.1)',
          'white-heavy': 'rgba(255, 255, 255, 0.4)',
        }
      }
    },
  },
  plugins: [],
}
