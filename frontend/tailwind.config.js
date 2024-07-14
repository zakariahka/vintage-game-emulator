module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        navy: '#003f5c',
        beige: '#f5f5dc',
        brownRed: '#8b0000',
      },
      fontFamily: {
        arcade: ['"Press Start 2P"', 'cursive'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
