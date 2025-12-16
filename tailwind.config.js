/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        highlight: "#0041D9",
        "highlight-dark": "#00268B",
        "nav-hover": "#D4D7FF",
        "text-dark": "#4B4B4B",
        "bg-main": "#FCFCFC",
        button: "#F4A261",
        muted: "#DBDBDB",
      },
    },
  },
  plugins: [],
};
