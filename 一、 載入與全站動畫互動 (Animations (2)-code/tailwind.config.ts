import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}',
    './types/**/*.{js,ts,jsx,tsx}',
    './context/**/*.{js,ts,jsx,tsx}',
    './stores/**/*.{js,ts,jsx,tsx}',
    './data/**/*.{js,ts,jsx,tsx}',
    './config/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#4f46e5',
        accent: '#818cf8',
        background: '#fafafa',
        foreground: '#18181b',
        muted: '#f4f4f5',
        border: '#e4e4e7',
        destructive: '#ef4444',
        success: '#22c55e',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        display: ['Instrument Serif', 'serif'],
      },
      borderRadius: {
        none: '0',
        sm: '0.375rem',
        md: '0.75rem',
        lg: '1rem',
        full: '9999px',
      },
      spacing: {
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem'
      },
    },
  },
  plugins: [],
}

export default config