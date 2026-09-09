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
        forest: {
          50: "#f2f7f2",
          100: "#e2ede2",
          200: "#c7dcc7",
          300: "#a0c4a1",
          400: "#72a574",
          500: "#4f8752",
          600: "#3d6d3f",
          700: "#325734",
          800: "#2a462c",
          900: "#144518", // Official Humming Drops Forest Green
          950: "#0b260e",
        },
        leaf: {
          400: "#417b08",
          500: "#2e7301", // Official Logo Leaf Accent
          600: "#255c01",
        },
        teal: {
          50: "#f0f9f8",
          100: "#d7f0ed",
          200: "#b2e1dc",
          300: "#83cdc6",
          400: "#4fb2a9",
          500: "#33968e",
          600: "#267771",
          700: "#156c63", // Official MedCity Smiles Mindful Teal
          800: "#194f4b",
          900: "#0d5049", // Deep Pine Teal
          950: "#082926",
        },
        cream: {
          50: "#fdfcf7", // Warm Morning Paper Canvas
          100: "#f7f5ea",
          200: "#eee9d3",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        botanical: "0 4px 20px -2px rgba(20, 69, 24, 0.06)",
        mindful: "0 4px 20px -2px rgba(21, 108, 99, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
