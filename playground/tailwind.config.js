/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        primary: '#141318',
        secondary: {
          main: '#19181F',
          1: '#676472',
          2: '#B3B1B8',
          3: '#1C1A24',
          4: '#2B2932',
          5: '#8D8A95',
          6: '#a1a1a3'
        },
        accent: {
          1: '#B490FF',
          2: '#773EF0'
        },
        green: '#1b911b'
      }
    },
    palette: {
      mode: 'dark',
      primary: {
        main: '#7b3fe4'
      },
      secondary: {
        main: '#efe2fe'
      },
      background: {
        default: '#fafafa'
      }
    }
  },

  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
};
