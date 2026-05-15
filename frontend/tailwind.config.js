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
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981", // Agro Green (Emerald)
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        secondary: "#64748b",
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
        info: "#0ea5e9",
        dark: "#1e293b",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'konrix': '0 0.125rem 0.25rem rgba(165, 163, 174, 0.3)',
        'konrix-lg': '0 0.5rem 1.125rem rgba(165, 163, 174, 0.3)',
      },
      borderRadius: {
        'konrix': '0.375rem',
      }
    },
  },
  plugins: [],
}
