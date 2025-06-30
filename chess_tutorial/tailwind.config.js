/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        chess: {
          light: "#f0d9b5",
          dark: "#b58863",
          highlight: "#ffffcc",
          move: "#a4d65e",
          check: "#ff6b6b",
          capture: "#ff8c94",
        },
      },
      animation: {
        "piece-move": "pieceMove 0.3s ease-in-out",
        "pulse-gentle": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        pieceMove: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
