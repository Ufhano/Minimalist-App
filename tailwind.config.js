/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#ffffff",
        gray: "#888888",
      },
      fontFamily: {
        sans: ["Inter_400Regular", "SpaceGrotesk_400Regular"],
      },
    },
  },
  plugins: [],
};
