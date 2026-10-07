import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// L'API est appelée via /api, comme en production (redirection Vercel → Railway) :
// même origine, donc cookie de session interne au site.
const apiProxy = {
  '/api': {
    // Surchargeable si le port 3000 est déjà pris : API_PROXY_TARGET=http://localhost:3001
    target: process.env.API_PROXY_TARGET ?? 'http://localhost:3000',
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/api/, ''),
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
})
