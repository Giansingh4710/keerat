/** @type {import('tailwindcss').Config} */
// const flowbite = require('flowbite-react/tailwind')
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#001f3f",
          200: "#F58F29",
          300: "#5a0e0e",
        },
        secondary: {
          100: "#0074D9",
          200: "#466995",
        },
        btn: "#FFA500",
        third: "#1D4ED8",
        fourth: "#466995",
        five: "#7D4600",
      },
    },
  },
  darkMode: "class",
  plugins: [
    // flowbite.plugin()
  ],
};
    // primary: '#001f3f',
    // secondary: '#F58F29',
    // third: "#FFA500",
    // fourth: '#466995',
    // five: '#7D4600',
