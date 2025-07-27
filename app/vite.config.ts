import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [react()],
  server: {
    host: true,
    watch: {
      usePolling: mode === 'development',
    },
  },
}))