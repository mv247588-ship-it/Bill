import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f8ff",
          100: "#e8f0ff",
          500: "#5867ff",
          700: "#3440c6"
        }
      }
    }
  },
  plugins: []
};

export default config;
