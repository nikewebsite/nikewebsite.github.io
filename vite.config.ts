import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Nike-Jordan-website/',
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});

export default defineConfig({
  base: '/Nike-Jordan-website/',
  // ... keep your existing plugins/config here
})
