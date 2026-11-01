import type { Config } from "tailwindcss";

// Colours are CSS custom properties named by role (see app/globals.css).
const role = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: { DEFAULT: role("green"), deep: role("green-deep") },
        loam: role("loam"),
        limestone: { DEFAULT: role("limestone"), deep: role("limestone-deep") },
        moss: role("moss"),
        paper: role("paper"),
        soil: { dry: role("soil-dry"), wet: role("soil-wet") },
        coneflower: role("coneflower"),
      },
      fontFamily: {
        display: ['"Newsreader Variable"', "Georgia", "serif"],
        sans: ['"Schibsted Grotesk Variable"', "Arial", "sans-serif"],
      },
      maxWidth: { page: "84rem", prose: "65ch" },
    },
  },
  plugins: [],
};

export default config;
