/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{jsx,ts,js,tsx}', './src/**/*.{jsx,ts,js,tsx}' , './src/**/**/*.{jsx,ts,js,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
