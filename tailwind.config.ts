import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Organization primary colors
        primary: {
          DEFAULT: "#ffc314",
          50: "#fffdf0",
          100: "#fffae0",
          200: "#fff3b8",
          300: "#ffe985",
          400: "#ffc314",
          500: "#f5b800",
          600: "#d49500",
          700: "#a87100",
          800: "#8b5a08",
          900: "#744a0c",
        },
        secondary: {
          DEFAULT: "#000000",
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#3d3d3d",
        },
      },
      fontFamily: {
        sans: ["DB Helvethaica", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
