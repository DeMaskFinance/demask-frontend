/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      height:{
        'header':'64px',
        'chart':'776px',
      },
      colors:{
        'gray-color':'#BFBDBD',
        'black24':'#242424',
        'dark':'#3C4048',
        'dark1':'#414754',
        'dark2':'#636977',
        'dark3':'#A3A9B9',
        'dark4':'#E6E7F1',
        'secondary1':'#514199',
        'secondary2':'#6957BB',
        'secondary3':'#6452B6',
        'secondary4':'#715DD0',
        'secondary5':'#9075FE',
        'white':'#FFFFFF',
        'logo':'#27E1C1',
        'base0':'#B3E5BE',
        'base1':'#0EA293',
        'base2':'#0E8388',
        'green':'#2DC8A8',
        'red':'#F15A59',
      },
      fontFamily:{
        'DMMono':['DM Mono', 'monospace'],
      },
      screens:{
        '3xl': '1600px',
      },
      fontSize:{
        'customDate':'15px',
      },
      keyframes: {
        scrollUpHeader: {
          '0%': { transform: 'translateY(-64px)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        scrollUpHeader: 'scrollUpHeader 0.3s ease-in-out',
      }
    },
  },
  plugins: [],
}
