//src/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    // You can add more directories here if needed:
    // './pages/**/*.{js,ts,jsx,tsx,mdx}',
    // './components/**/*.{js,ts,jsx,tsx,mdx}',
    // './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ✅ Custom Animations
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out',
        'gradient-border-anim': 'gradient-move 2s ease-in-out forwards',
        'gradient-border-anim-loop': 'gradient-move 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-move': {
          '0%': {
            'background-position': '0% 100%',
          },
          '50%': {
            'background-position': '100% 0%',
          },
          '100%': {
            'background-position': '100% 0%',
          },
        },
      },
      // ✅ Font Families
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        comic: ['"Comic Neue"', 'cursive'],       // Main doodle font
        hand: ['"Patrick Hand"', 'cursive'],      // Optional secondary font
      },
    },
  },
  plugins: [],
};
