import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Ticket-Time/',
  server: {
    port: 5174, // Cambia el número de puerto al que prefieras
    host: true, // Esto habilita la conexión en red
  },
})
