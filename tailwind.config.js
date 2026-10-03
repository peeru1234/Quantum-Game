/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          cyan: '#00f3ff',
          blue: '#0066ff',
          purple: '#9d00ff',
          pink: '#ff00a0',
          dark: '#050714',
          panel: 'rgba(10, 15, 30, 0.85)'
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite alternate',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 243, 255, 0.4)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 243, 255, 0.9), 0 0 50px rgba(157, 0, 255, 0.6)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
