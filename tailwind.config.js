/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        darkBlue: "#121524",
        steelBlue: "#384C65",
        primary: "#485F88",
        paleBlue: "#9DACCC",
        mist: "#C0C9DB",
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', "serif"],
        paragraph: ['"Inter"', "sans-serif"],
      },
      fontSize: {
        heading0: "2rem",
        heading1: "1.5rem",
        heading2: "1.25rem",
        heading3: "1rem",
        paragraphLg: "1rem",
        paragraph: "0.75rem",
      },
    },
  },
  plugins: [],
};
