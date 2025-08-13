/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        nebula: ['Nebula', 'sans-serif'],
        moonwalkmiss: ['Moonwalk Miss', 'cursive'],
        csclairemonodrawn: ['CSClaireMonoDrawn', 'monospace'],
      },
   
      colors: {
        'primary-red': '#A50C20',
        'primary-black': '#101111',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
}



