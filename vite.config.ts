import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' makes the build work under any GitHub Pages repository name.
export default defineConfig({ base: './', plugins: [react()] })
