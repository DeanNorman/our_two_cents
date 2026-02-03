/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        groceries: '#7CB87A',
        transport: '#4A90E2',
        dining: '#C47FD4',
        entertainment: '#F5A623',
        utilities: '#50E3C2',
        housing: '#D0021B',
        shopping: '#BD10E0',
        health: '#7ED321',
        savings: '#417505',
        other: '#9013FE',
        coral: {
          400: '#FF6B6B',
          500: '#FF5252',
          600: '#FF3838',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
