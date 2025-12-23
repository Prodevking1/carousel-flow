/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0A66C2',
          light: '#378FE9',
          dark: '#004182',
        },
      },
    },
  },
  plugins: [],
};
