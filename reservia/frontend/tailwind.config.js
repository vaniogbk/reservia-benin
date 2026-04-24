/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:     { DEFAULT: '#1B6CA8', 50: '#EBF4FB', 500: '#1B6CA8', 700: '#134E7A' },
        terracotta:  { DEFAULT: '#C4603A', 50: '#FBF0EB', 500: '#C4603A', 700: '#9B4A2B' },
        sand:        { DEFAULT: '#F5EFE0', 50: '#FBF8F2' },
        earth:       { DEFAULT: '#C8A97A' },
        dark:        { DEFAULT: '#1E1810' },
      },
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
