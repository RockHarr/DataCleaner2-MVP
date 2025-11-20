// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/DataCleaner2-MVP/',   // 👈 importante para Pages en subcarpeta
})
