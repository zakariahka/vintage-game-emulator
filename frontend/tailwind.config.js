/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1E3A8A',
        beige: '#F5F5DC',
        primary: '#1E3A8A',
        secondary: '#F5F5DC',
      },
    },
  },
  plugins: [],
}
