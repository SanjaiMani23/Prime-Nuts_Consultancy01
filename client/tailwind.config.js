/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#FFF7E8',
          100: '#FEEDD3',
          200: '#FDDAA8',
          300: '#FCC77C',
          400: '#FAA93D',
          500: '#F28C00', // Saffron Orange
          600: '#D96500', // Deep Orange
          700: '#B34E00',
          800: '#8C3B00',
          900: '#662B00',
        },
        cream: {
          50: '#FFFCF6', // Soft White
          100: '#FFF7E8', // Warm Cream
          200: '#FBF0DC',
          300: '#F5E5C9',
          400: '#EBD4B0',
        },
        chocolate: {
          400: '#754B33',
          500: '#5C3825',
          600: '#482A1C',
          700: '#3A1F13',
          800: '#321B10',
          900: '#2B160D', // Dark Chocolate
          950: '#1F0F08',
        },
        caramel: {
          200: '#F2D7B3',
          300: '#E8BE88',
          400: '#DFB172',
          500: '#D8A15D', // Caramel Beige
          600: '#BD843E',
          700: '#9C6829',
        },
        ivory: {
          50: '#FFF7E8', // Warm Cream
          100: '#FFFCF6', // Soft White
          200: '#FBF0DC',
          300: '#F5E5C9',
          400: '#D8A15D',
          500: '#C5914D',
        },
        sand: {
          50: '#FFFCF6',
          100: '#FFF7E8',
          200: '#F5E5C9',
          300: '#E8BE88',
          400: '#D8A15D',
        },
        espresso: {
          950: '#1F0F08',
          900: '#2B160D', // Dark Chocolate
          800: '#321B10',
          700: '#3A1F13',
          600: '#482A1C',
          500: '#5C3825',
          400: '#754B33',
        },
        gold: {
          50: '#FFF7E8',
          100: '#FEEDD3',
          200: '#FDDAA8',
          300: '#FCC77C',
          400: '#FAA93D',
          500: '#F28C00', // Saffron Orange
          600: '#D96500', // Deep Orange
          700: '#B34E00',
          800: '#8C3B00',
        },
        champagne: {
          100: '#FFF7E8',
          200: '#FEEDD3',
          300: '#E8BE88',
          400: '#D8A15D',
          500: '#BD843E',
        },
        spice: {
          500: '#F28C00',
          600: '#D96500',
          700: '#B34E00',
        },
        charcoal: {
          950: '#1F0F08',
          900: '#2B160D',
          800: '#382218',
          700: '#4A3226',
          600: '#634739',
          500: '#7F6253',
        }
      },
      fontFamily: {
        sans: ['"Manrope"', '"Noto Sans Tamil"', 'system-ui', 'sans-serif'],
        tamil: ['"Noto Sans Tamil"', '"Manrope"', 'sans-serif'],
        serif: ['"Noto Serif Tamil"', 'Georgia', 'serif'],
        display: ['"Noto Sans Tamil"', '"Manrope"', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(23, 14, 9, 0.08), 0 0 1px 1px rgba(23, 14, 9, 0.05)',
        'luxury-hover': '0 30px 60px -12px rgba(23, 14, 9, 0.14), 0 0 1px 1px rgba(194, 147, 41, 0.2)',
        'gold-glow': '0 0 25px rgba(194, 147, 41, 0.25)',
        'card-warm': '0 4px 20px -2px rgba(35, 22, 16, 0.06)',
        'drawer': '-10px 0 35px -5px rgba(23, 14, 9, 0.25)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-shimmer': 'linear-gradient(135deg, #C29329 0%, #F4ECCC 50%, #A4771B 100%)',
        'espresso-luxury': 'linear-gradient(180deg, #231610 0%, #170E09 100%)',
        'ivory-warm': 'linear-gradient(180deg, #FDFBF7 0%, #F5EFE6 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 4s ease-in-out infinite',
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
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
