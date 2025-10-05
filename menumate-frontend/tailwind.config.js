// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6347', // Tomato Red
        secondary: '#333333', // Dark Gray for text
        background: '#FDFDFF', // Off-white
        accent: '#4682B4', // Steel Blue
      }
    },
  },
  plugins: [],
}