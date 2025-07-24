// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.HOST || '0.0.0.0', // ✅ Allows Docker/Vercel compatibility
    port: Number(process.env.PORT) || 5173 // ✅ Uses env PORT or defaults to 5173
  },
  build: {
    outDir: 'dist', // ✅ Required for Vercel to know the output folder
  }
});
