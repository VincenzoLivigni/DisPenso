/** @type {import('tailwindcss').Config} */
module.exports = {
  // Aggiunto "./App.{js,jsx,ts,tsx}" come primo elemento qui sotto!
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}