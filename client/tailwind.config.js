/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-black': '#0a0a0a',
        'rich-gray': '#1c1c1c',
        'brand-red': '#E50914',
        'brand-dark-red': '#B20710',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-vignette': 'linear-gradient(to top, #0a0a0a 10%, transparent 80%)',
        'card-gradient': 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
      },
      fontFamily: {
        sans: ['Oswald', 'sans-serif'], // Cinematic condensed font
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'intro-scale': 'introScale 2.5s ease-in-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        introScale: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '20%': { transform: 'scale(1)', opacity: '1' },
          '80%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(20)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
