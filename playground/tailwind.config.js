/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {},
    palette: {
      mode: "light",
      primary: {
        main: "#7b3fe4",
      },
      secondary: {
        main: "#efe2fe",
      },
      background: {
        default: "#fafafa",
      },
    },
  },
  
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};

