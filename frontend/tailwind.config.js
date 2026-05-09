/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lab: {
          bg: '#0a0a0f',
          surface: '#12121a',
          card: '#1a1a28',
          border: '#2a2a3d',
          hover: '#252538',
          accent: '#6c5ce7',
          'accent-light': '#a29bfe',
          'accent-glow': 'rgba(108, 92, 231, 0.3)',
          success: '#00cec9',
          warning: '#fdcb6e',
          danger: '#ff6b6b',
          text: '#e8e8f0',
          muted: '#8888a0',
          dim: '#5a5a72',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108, 92, 231, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(108, 92, 231, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(108, 92, 231, 0.3)',
        'glow-lg': '0 0 40px rgba(108, 92, 231, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(108, 92, 231, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
