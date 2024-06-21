import type { Config } from "tailwindcss";

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
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      height: {
        header: "56px",
      },
      backgroundImage: {
        "event-gradient":
          "linear-gradient(90deg, #7B80F6 0%, #CD5FE2 33.33%, #846AF0 66.67%, #31AFF0 100%)",
        "linear-g2":
          "linear-gradient(90deg, #EEFEFF 0%, #99E0FF 25%, #60A5FA 50%, #7B7EF3 75%, #9B78FC 100%)",
      },
      fontSize: {
        medium: "4rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
