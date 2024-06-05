/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        nft: "var(--nftItem.metadata.image)",
        'linear-g2': 'linear-gradient(90deg, #EEFEFF 0%, #99E0FF 25%, #60A5FA 50%, #7B7EF3 75%, #9B78FC 100%)',
      },
      height: {
        header: "56px",
        chart: "776px",
      },
      lineHeight: {
        normal: "18px",
      },
      padding: {
        primary: "56px",
        secondary: "272px",
      },
      colors: {
        "gray-color": "#BFBDBD",
        shader_900: "#13151A",
        shader_800: "#181A20",
        shader_700: "#1C1E26",
        shader_600: "#21242D",
        shader_500: "#262A35",
        shader_400: "#3A404D",
        shader_300: "#687184",
        shader_200: "#A0ACC1",
        shader_100: "#CFD9E9",
        primary_900: "#211679",
        primary_800: "#342593",
        primary_700: "#4E3AB6",
        primary_600: "#6C55DA",
        primary_500: "#9075FE",
        primary_400: "#AD97FE",
        primary_300: "#BFACFE",
        primary_200: "#D6C7FE",
        primary_100: "#EBE3FE",
        white: "#FFF",
        logo: "#7413DC",
        base0: "#A398FF",
        base1: "#D5D0FF",
        base2: "#DFDBFF",
        green: "#04B186",
        red: "#EF4444",
        yellow: "#FFA959",
        blue: "#22D3EE",
        purple: "#7413DC",
      },
      fontFamily: {
        DMMono: ["DM Mono", "monospace"],
      },
      screens: {
        "3xl": "1600px",
      },
      fontSize: {
        customDate: "15px",
      },
      textShadow: {
        sm: '0 0 12px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
      },
      boxShadow: {
        home: "0px 4px 12px 0px rgba(0, 0, 0, 0.08)",
        swiper: "rgba(0, 0, 0, 0.15) 0px 4px 10px",
        chart: "0px 8px 24px 0px rgba(0, 0, 0, 0.15)",
        about: "#9075FE 0px 22px 70px 4px",
      },
      keyframes: {
        scrollUpHeader: {
          "0%": { transform: "translateY(-56px)" },
          "100%": { transform: "translateY(0)" },
        }
      },
      animation: {
        scrollUpHeader: "scrollUpHeader 0.3s ease-in-out",
        "spin-360": "spin 0.5s linear",
      },
      container: {
        main: "1048px",
      },
      flex: {
        20: "1 1 20%",
        15: "1 1 15%",
      },
      rotate: {
        '25': '25deg',
      },
      borderRadius: {
        10:"10px"
      }
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        body: {
          "--bg-url": "none",
        },
      });
    }),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
};
