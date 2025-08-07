/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#FBFBFB',
        lightBlue: '#E8F9FF',
        skyBlue: '#C4D9FF',
        softPurple: '#C5BAFF',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}