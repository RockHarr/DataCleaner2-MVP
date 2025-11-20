import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// OJO: usa exactamente el nombre del repo
export default defineConfig({
  plugins: [react()],
  base: '/DataCleaner2-MVP/',
})
