/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      montserrat: ["Montserrat", 'sans-serif'],
      lato: ["Lato", 'sans-serif'],
    },
    colors: {
      'royal-purple': '#6e38f8',
      'deep-purple': '#2c0593',
      'teal-sky': '#1b8096',
      'pink-empahsis': '#cc2e72',
      'white': '#fff',
      'black': '#000',
      'grey': '#aaa',
      'blue': '#4285F4',
    },

  },
  plugins: [],
}