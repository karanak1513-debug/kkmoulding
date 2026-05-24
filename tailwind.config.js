/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#FDFBF7', // Cream / Ivory
          beige: '#F5EBE0', // Soft Beige
          sand: '#E3D5CA',  // Warm Sand
          wood: '#A38068',  // Premium Wood Brown
          gold: '#C5A880',  // Soft Gold
          dark: '#2F2519',  // Dark Wood / Charcoal
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
