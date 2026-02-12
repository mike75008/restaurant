import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFDF7",
          100: "#FDF6EC",
          200: "#F5E6CC",
          300: "#EDD6AC",
          400: "#E5C68C",
          500: "#DDB66C",
        },
        bordeaux: {
          50: "#FDF2F4",
          100: "#F5D0D6",
          200: "#E8A1AD",
          300: "#D47284",
          400: "#B8435B",
          500: "#8B1A32",
          600: "#6B1D2A",
          700: "#4D0E1C",
          800: "#30070F",
          900: "#1A0308",
        },
        or: {
          50: "#FFF9ED",
          100: "#FDF0D5",
          200: "#F0D9A8",
          300: "#E0C080",
          400: "#C9A96E",
          500: "#B8924E",
          600: "#9A7A3E",
          700: "#7C622F",
          800: "#5E4A20",
          900: "#403210",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "slide-up": "slideUp 0.8s ease-out forwards",
        "gold-shimmer": "goldShimmer 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        goldShimmer: {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
