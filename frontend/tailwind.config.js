module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
      },
      backgroundColor: {
        light: '#ffffff',
        'light-secondary': '#f9fafb',
        dark: '#1f2937',
        'dark-secondary': '#111827',
      },
      textColor: {
        'light-primary': '#1f2937',
        'light-secondary': '#6b7280',
        'dark-primary': '#f9fafb',
        'dark-secondary': '#d1d5db',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
