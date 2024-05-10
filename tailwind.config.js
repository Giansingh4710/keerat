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
          200: "#0074D9",
          300: "#5a0e0e",
        },
        secondary: {
          100: '#F58F29',
          200: "#FFA500",
        },
        // third: '',
        third: '#1D4ED8',
        fourth: '#466995',
        five: '#7D4600',
      },
    },
  },
  darkMode: "class",
  plugins: [
    // flowbite.plugin()
  ],
};
