/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      colors: {
        // User custom palette
        warm: {
          50: '#FFFDFD',
          100: '#FFF5F5', // Primary background from image
          200: '#FDEAE8',
          300: '#F7D6D0', // Peach accent from image
          400: '#EBB4AC',
          500: '#E2B4BD', // Mauve / dusty rose from image
          600: '#D495A2',
          700: '#B87281',
          800: '#944E5E',
          900: '#6B313E',
        },
        // Toggl Berry Primary Accent
        berry: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#C4228C', // Toggl Track Magenta / Berry
          600: '#B02A82',
          700: '#9D174D',
          800: '#831843',
          900: '#500724',
        },
        // Charcoal text palette
        charcoal: {
          50: '#F7F7F7',
          100: '#EFEFEF',
          200: '#DCDCDC',
          300: '#BDBDBD',
          400: '#8A8A8A',
          500: '#757575',
          600: '#5A5A5A',
          700: '#4A4A4A', // Text color from image
          800: '#333333',
          900: '#222222',
          950: '#151515',
        },
        // Surface & borders
        surface: {
          white: '#FFFFFF',
          soft: '#FFF5F5',
          muted: '#F9F5F5',
          border: '#F0E6E6',
          borderStrong: '#E2B4BD',
        },
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(74, 74, 74, 0.04)',
        'sm': '0 1px 3px 0 rgba(74, 74, 74, 0.06), 0 1px 2px -1px rgba(74, 74, 74, 0.04)',
        'card': '0 2px 8px -2px rgba(74, 74, 74, 0.05), 0 1px 4px -1px rgba(74, 74, 74, 0.03)',
        'card-hover': '0 12px 24px -6px rgba(74, 74, 74, 0.08), 0 4px 12px -2px rgba(74, 74, 74, 0.04)',
        'modal': '0 24px 48px -12px rgba(74, 74, 74, 0.18)',
        'glow-berry': '0 4px 16px -2px rgba(176, 42, 130, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out both',
        'fade-in-up': 'fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both',
        'count-up': 'countUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
