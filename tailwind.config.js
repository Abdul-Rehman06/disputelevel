/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#0B3D2E',
        green: '#159447',
        mist: '#F4F8F5',
        ink: '#10231A',
      },
      boxShadow: {
        lift: '0 22px 55px rgba(11, 61, 46, 0.12)',
      },
    },
  },
  plugins: [],
};
