import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // University of Michigan Brand Colors
        'michigan-blue': '#00274C',
        'michigan-maize': '#FFCB05',
        'michigan-tappan-blue': '#0D5CA6',
        'michigan-arboretum-blue': '#2F65A7',
        'michigan-wave-blue': '#83B2E3',
        'michigan-taubman-teal': '#00B2A9',
        'michigan-ross-orange': '#FF6600',
        'michigan-midnight': '#131516',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
