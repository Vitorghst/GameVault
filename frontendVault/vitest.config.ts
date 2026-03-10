import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    include: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'] // 👈 força JSX em .js
  })],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    exclude: ['**/App.test.{js,jsx}','**/node_modules/**', '**/dist/**', '**/build/**'],
  }
})