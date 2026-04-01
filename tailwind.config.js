// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  // tailwind.config.js
  theme: {
    extend: {
      colors: {
        primary: '#a855f7',
        primaryDark: '#9333ea',
        accent: '#d946ef',
        background: '#0d0d0d',
        muted: '#2d1f35',
      }
    }
  },

  plugins: [
    require("tailwindcss-animate"), // this is needed for smooth collapsible
  ],
};
