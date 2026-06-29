/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#FAFBFC', // Clean off-white bg (Apple/Stripe style)
          section: '#F4F6F8',
          card: '#FFFFFF',
        },
        brand: {
          primary: '#10B981', // Emerald green for premium clean look
          primaryLight: '#E6F8F2',
          secondary: '#4F46E5', // Royal indigo for coach mode
          secondaryLight: '#EEF2FF',
        },
        accent: {
          orange: '#F97316',
          orangeLight: '#FFF7ED',
          purple: '#8B5CF6',
          purpleLight: '#F5F3FF',
        },
        text: {
          primary: '#0F172A', // Slate-900 for dark crisp text
          secondary: '#475569', // Slate-600 for subtext
          muted: '#94A3B8', // Slate-400 for placeholders
        },
        border: {
          default: '#E2E8F0', // Slate-200 for clean light borders
          light: '#F1F5F9', // Slate-100 for very soft divides
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05), 0 4px 12px 0 rgba(0, 0, 0, 0.02)',
        cardHover: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 16px -6px rgba(0, 0, 0, 0.03)',
        dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.03), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        card: '20px', // Softer, modern corners
        btn: '12px',
        input: '12px',
      },
    },
  },
  plugins: [],
}
