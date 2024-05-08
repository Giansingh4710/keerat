/** @type {import('tailwindcss').Config} */
const flowbite = require('flowbite-react/tailwind')
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    flowbite.content(),
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [flowbite.plugin()],
}
