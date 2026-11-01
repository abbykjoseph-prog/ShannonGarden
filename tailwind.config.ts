import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // The original build's palette. Brand green sampled from "Garden Logo Long.png".
        forest: { DEFAULT: "#395437", deep: "#243822", night: "#1A2819" },
        sage: { DEFAULT: "#C9D8BF", soft: "#E3EBDC" },
        cream: { DEFAULT: "#F6F1E6", warm: "#EFE7D6" },
        ink: "#1C211B",
        loam: "#6B4A33",
        clay: "#B5643C",
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
