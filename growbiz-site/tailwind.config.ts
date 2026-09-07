import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        plum: {
          50: "#F8F4FC",
          100: "#F0E6F8",
          200: "#DEC7EF",
          300: "#C39EE0",
          400: "#A56FCB",
          500: "#7F3FA8",
          600: "#5B2A82",
          650: "#4C2270",
          700: "#452066",
          800: "#301648",
          900: "#1F0E30",
        },
        ink: "#211C29",
        mist: "#6E6479",
        gold: {
          400: "#D9AE5C",
          500: "#C99A3B",
          600: "#A97D28",
        },
        paper: "#FCFBFE",
        line: "#E7E1EF",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      maxWidth: {
        content: "1180px",
      },
      borderRadius: {
        card: "12px",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 8px 24px -12px rgba(31, 14, 48, 0.18)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};
export default config;
