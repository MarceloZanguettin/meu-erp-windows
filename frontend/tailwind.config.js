/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  // preflight: false evita que o reset do Tailwind quebre o CSS legado existente
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        // Paleta do ERP (complementa o CSS existente)
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        slate: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        erp: {
          header:  '#2c3e50',
          success: '#16a34a',
          danger:  '#dc2626',
          warning: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        window: '8px',
      },
      boxShadow: {
        window: '0 10px 30px rgba(0,0,0,0.3)',
        card:   '0 2px 10px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
};
