
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-heading': 'var(--text-heading)',
        'accent-primary': 'var(--accent-primary)',
        'accent-light': 'var(--accent-light)',
        'accent-dark': 'var(--accent-dark)',
        'border-light': 'var(--border-light)',
        'border-dark': 'var(--border-dark)',
        'status-applied': 'var(--status-applied)',
        'status-rejected': 'var(--status-rejected)',
        'status-interview': 'var(--status-interview)',
        'status-success': 'var(--status-success)',
      },
      fontFamily: {
        inter: ['var(--font-family-primary)', 'sans-serif'],
      },
      fontSize: {
        'h1': 'var(--font-size-h1)',
        'h2': 'var(--font-size-h2)',
        'h3': 'var(--font-size-h3)',
        'h4': 'var(--font-size-h4)',
        'base': 'var(--font-size-base)',
        'sm': 'var(--font-size-small)',
        'xs': 'var(--font-size-xsmall)',
      },
      fontWeight: {
        'light': 'var(--font-weight-light)',
        'regular': 'var(--font-weight-regular)',
        'semibold': 'var(--font-weight-semibold)',
        'bold': 'var(--font-weight-bold)',
        'extrabold': 'var(--font-weight-extrabold)',
      },
      lineHeight: {
        'body': 'var(--line-height-body)',
        'heading': 'var(--line-height-heading)',
      },
      letterSpacing: {
        'tight-heading': 'var(--letter-spacing-heading-tight)',
      },
    },
  },
  plugins: [],
};

export default config;
