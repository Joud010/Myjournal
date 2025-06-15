import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // oder einfach 'true' für automatische IP-Erkennung
    port: 5173
  }
})
