import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary:"#FFFFFF",
        secondary:{
          DEFAULT:"#563A9C",
          100:"#6A42C2",
          200:"#8B5DFF",
          300:"#FFF7D1"
        }
      },
      fontFamily:{
        pf:["var(--font-playfair-display)", ...fontFamily.serif],
        delius: ["var(--font-delius-swash-caps)", ...fontFamily.sans],
      }
    },
  },
  plugins: [],
} satisfies Config;
