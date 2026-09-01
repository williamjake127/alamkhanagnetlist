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
        primary: "#FFDF34",
        deep_black: "#1F2029",
        light_black: "#272A34",
        blue: "#1877F2",
        success: "#39AE41",
        error: "#FF3D3D",
        gray: "#9CA3AF",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "sans-serif"],
        hind: ["var(--font-hind-siliguri)", "Hind Siliguri", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
