import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Keep existing brand colors (pink theme)
        brand: {
          50: '#ffe6f0',
          100: '#ffc2db',
          200: '#ff9dc6',
          300: '#ff78b1',
          400: '#ff539c',
          500: '#ff2e87', // Primary brand color
          600: '#cc2569',
          700: '#991c4e',
          800: '#661234',
          900: '#33091a',
        },
        // Add chart colors for analytics
        chart: {
          business: '#3b82f6',
          technology: '#8b5cf6',
          sports: '#22c55e',
          entertainment: '#f59e0b',
          health: '#ef4444',
          science: '#06b6d4',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
