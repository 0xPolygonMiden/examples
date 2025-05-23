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
          6: '#A1A1A3',
          7: '#FFFFFF99',
          8: '#24202F'
        },
        borderColor: '#1F1E25',
      
        // Updated to orange tones from brand sheet
        accent: {
          1: '#FA8448', // Mid orange (formerly B490FF)
          2: '#FF5500'  // Base orange (formerly 773EF0)
        },
        green: '#39C707C7',
        hoverBg: '#ffffff0a'
      },
      fontFamily: {
        geist: ['Geist', 'sans-serif'],
        'geist-mono': ['Geist Mono', 'monospace']
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
