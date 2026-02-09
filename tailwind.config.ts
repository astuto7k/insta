import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue'
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0B0B0E',
          secondary: '#111114',
          card: '#0F0F13'
        },

        pink: {
          50: '#fde8f3',
          100: '#fbcfe8',
          200: '#f7a8d4',
          300: '#f178bc',
          400: '#ea4fa7',
          500: '#d62b9d',
          600: '#b91e84',
          700: '#9f166f',
          800: '#83115c',
          900: '#6b0f4c',
          950: '#45072f'
        }
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },

      animation: {
        float: 'float 20s linear infinite'
      },

      keyframes: {
        float: {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100px) rotate(360deg)', opacity: '0' }
        }
      }
    }
  }
}
