import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // necesario en webcontainer
    port: 5173, // el que espera el preview
    strictPort: true, // falla si está ocupado (mejor para diagnosticar)
  },
  preview: {
    host: true,
    port: 5173,
  },
});
