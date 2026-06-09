/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: "#4f8ef7",
        "brand-dark": "#3b7cf0",
        "brand-light": "#6fa4ff",
        accent: "#7c5cfc",
        "surface-1": "#181c27",
        "surface-2": "#1e2333",
        "surface-3": "#252b3b",
        "crm-border": "#2a3045",
        "crm-border-light": "#353d57",
        "crm-muted": "#7a8299",
        "crm-muted-dark": "#4a5268",
      },
      fontFamily: {
        sans: ["DM Sans", "Inter", "ui-sans-serif", "system-ui"],
        mono: ["DM Mono", "JetBrains Mono", "ui-monospace"],
      },
      keyframes: {
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { transform: "translateY(10px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
      },
      animation: {
        fadeIn:  "fadeIn 0.2s ease",
        slideUp: "slideUp 0.25s ease",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
