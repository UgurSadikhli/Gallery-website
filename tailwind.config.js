/** @type {import('tailwindcss').Config} */
const c = (n) => `rgb(var(--${n}) / <alpha-value>)`;
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { canvas: c('canvas'), surface: c('surface'), ivory: c('ivory'), gold: c('gold') },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
