import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fffffe",
        card: "#faeee7",
        headline: "#33272a",
        paragraph: "#594a4e",
        highlight: "#ff8ba7",
        secondary: "#ffc6c7",
        tertiary: "#c3f0ca",
      },
    },
  },
  plugins: [],
} satisfies Config;

