import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");
const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      // main: "1048px",
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        nft: "var(--nftItem.metadata.image)",
        "linear-g2":
          "linear-gradient(90deg, #EEFEFF 0%, #99E0FF 25%, #60A5FA 50%, #7B7EF3 75%, #9B78FC 100%)",
        "referral-gradient":
          "linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, #BCB4FF 80%, rgba(255, 255, 255, 0.00) 100%)",
        "event-gradient":
          "linear-gradient(90deg, #7B80F6 0%, #CD5FE2 33.33%, #846AF0 66.67%, #31AFF0 100%)",
      },
      opacity: {
        15: "0.15",
      },
      height: {
        header: "56px",
        chart: "776px",
      },
      lineHeight: {
        normal: "18px",
      },
      gridTemplateColumns: {
        autoFill: "repeat(auto-fill, minmax(220px, 1fr))",
      },
      padding: {
        primary: "56px",
        secondary: "272px",
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
        sm: "0 0 12px var(--tw-shadow-color)",
        DEFAULT: "0 2px 4px var(--tw-shadow-color)",
        lg: "0 8px 16px var(--tw-shadow-color)",
      },
      boxShadow: {
        home: "0px 4px 12px 0px rgba(0, 0, 0, 0.08)",
        swiper: "rgba(0, 0, 0, 0.15) 0px 4px 10px",
        chart: "0px 8px 24px 0px rgba(0, 0, 0, 0.15)",
        about: "#9075FE 0px 22px 70px 4px",
      },
      flex: {
        20: "1 1 20%",
        15: "1 1 15%",
      },
      rotate: {
        "25": "25deg",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        10: "10px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        scrollUpHeader: {
          "0%": { transform: "translateY(-56px)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        scrollUpHeader: "scrollUpHeader 0.3s ease-in-out",
        "spin-360": "spin 0.5s linear",
      },
      inset: {
        center: "25% 50% auto auto",
      },
      transformOrigin: {
        "center-right": "center right",
      },
      transitionDuration: {
        "6000": "6000ms",
      },
    },
  },
  // important: true,
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "text-shadow": (value: number) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") }
      );
    }),
  ],
} satisfies Config;

export default config;
