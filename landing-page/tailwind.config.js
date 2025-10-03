/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
        purple: {
          900: '#581c87',
          800: '#6b21a8',
          700: '#7e22ce',
          600: '#9333ea',
          500: '#a855f7',
          400: '#c084fc',
          300: '#d8b4fe',
        },
        pink: {
          900: '#831843',
          800: '#9d174d',
          700: '#be185d',
          600: '#db2777',
          500: '#ec4899',
          400: '#f472b6',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        mono: ['source-code-pro', 'Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#e2e8f0',
            a: {
              color: '#a855f7',
              '&:hover': {
                color: '#c084fc',
              },
            },
            h1: {
              color: '#f1f5f9',
            },
            h2: {
              color: '#f1f5f9',
            },
            h3: {
              color: '#f1f5f9',
            },
            h4: {
              color: '#f1f5f9',
            },
            strong: {
              color: '#f1f5f9',
            },
            code: {
              color: '#f1f5f9',
            },
            blockquote: {
              color: '#cbd5e1',
              borderLeftColor: '#9333ea',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
