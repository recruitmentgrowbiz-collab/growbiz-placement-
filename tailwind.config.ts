import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          accent: "rgb(var(--gb-magenta) / <alpha-value>)",
          primary: "rgb(var(--gb-magenta-action) / <alpha-value>)",
          hover: "rgb(var(--gb-magenta-hover) / <alpha-value>)",
          subtle: "rgb(var(--gb-magenta-soft) / <alpha-value>)",
        },
        plum: {
          50: "rgb(var(--gb-magenta-soft) / <alpha-value>)",
          100: "rgb(var(--gb-accent-100) / <alpha-value>)",
          200: "rgb(var(--gb-accent-200) / <alpha-value>)",
          300: "rgb(var(--gb-accent-300) / <alpha-value>)",
          400: "rgb(var(--gb-accent-400) / <alpha-value>)",
          500: "rgb(var(--gb-magenta) / <alpha-value>)",
          600: "rgb(var(--gb-magenta-action) / <alpha-value>)",
          650: "rgb(var(--gb-magenta-hover) / <alpha-value>)",
          700: "rgb(var(--gb-magenta-hover) / <alpha-value>)",
          800: "rgb(var(--gb-accent-800) / <alpha-value>)",
          900: "rgb(var(--gb-ink) / <alpha-value>)",
        },
        ink: "rgb(var(--gb-ink) / <alpha-value>)",
        mist: "rgb(var(--gb-text-muted) / <alpha-value>)",
        gold: {
          400: "#D9AE5C",
          500: "#C99A3B",
          600: "#A97D28",
        },
        paper: "rgb(var(--gb-surface-muted) / <alpha-value>)",
        surface: "rgb(var(--gb-surface) / <alpha-value>)",
        line: "rgb(var(--gb-border) / <alpha-value>)",
        success: "#15803D",
        warning: "#B45309",
        error: "#B42318",
        info: "#2563EB",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      maxWidth: {
        content: "1180px",
      },
      screens: {
        xs: "375px",
        sm: "430px",
        md: "768px",
        lg: "1024px",
        xl: "1440px",
      },
      borderRadius: {
        control: "10px",
        card: "12px",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 8px 24px -12px rgba(15, 23, 42, 0.18)",
        lift: "0 18px 40px -28px rgba(15, 23, 42, 0.24)",
      },
      zIndex: {
        header: "50",
        overlay: "60",
        drawer: "70",
        toast: "80",
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
