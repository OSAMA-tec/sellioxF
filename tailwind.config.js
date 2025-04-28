/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        poppins:["Josefin Sans","sans serif"]
      },
      colors:{
        primaryA0: "rgba(var(--primary-a0))",
        titleBlack: "rgba(var(--title-black))",
        grayAccent1: "rgba(var(--gray-accent1))",
        inputAccent1: "rgba(var(--input-accent1))",
        inputAccent2: "rgba(var(--input-accent2))",
        inputActive: "rgba(var(--input-active))",

      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
      }
    },
  },
  plugins: [],
}

