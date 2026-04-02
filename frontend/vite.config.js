import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias @ aponta para src/ — use em imports: '@/components/...', '@/hooks/...'
      '@': path.resolve(__dirname, './src'),
    },
  },
});
