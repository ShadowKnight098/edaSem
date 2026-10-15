import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Ensures assets load cleanly on GitHub Pages, Vercel, Netlify, or subpaths
  plugins: [
    react(),
    tailwindcss(),
  ],
})
