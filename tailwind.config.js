/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('tailwind-scrollbar')
  ],
  variants: {
    scrollbar: ['rounded']
}
}

