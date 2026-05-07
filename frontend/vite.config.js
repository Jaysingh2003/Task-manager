import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // In dev: proxy /api calls to Spring Boot
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  // In production build: output goes to Spring Boot's static folder
  build: {
    outDir: '../backend/src/main/resources/static',
    emptyOutDir: true
  }
})
