/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{jsx,ts,js}', './screens/**/*.{jsx,ts,js}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
