import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: [
        'src/lib/**/*.ts',
        'src/components/**/*.tsx',
        'src/app/actions/**/*.ts',
      ],
      exclude: [
        'src/lib/prisma/**',
        'src/lib/auth/**',
        'src/lib/sanity/client.ts',
        'src/**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
