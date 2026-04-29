/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A3A6E',
          50: '#EEF2F8',
          100: '#D4DEEC',
          200: '#A9BDDA',
          300: '#7E9BC7',
          400: '#537AB5',
          500: '#3A5F9C',
          600: '#1A3A6E',
          700: '#152F58',
          800: '#102342',
          900: '#0B182C',
        },
        secondary: { DEFAULT: '#C8A951' },
        surface: '#F5F7FA',
        ink: '#1F2937',
        success: '#16A34A',
        warning: '#D97706',
        error: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '1280px',
      },
    },
  },
  plugins: [],
};
