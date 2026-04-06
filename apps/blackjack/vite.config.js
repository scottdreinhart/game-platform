import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const __dirname = import.meta.dirname

export default defineConfig({
  base: './',
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/domain': resolve(__dirname, 'src/domain'),
      '@/app': resolve(__dirname, 'src/app'),
      '@/ui': resolve(__dirname, 'src/ui'),
      '@games/app-hook-utils': resolve(__dirname, '../../packages/app-hook-utils/src/index.ts'),
      '@games/banking': resolve(__dirname, '../../packages/banking/src/index.ts'),
      '@games/card-deck-core': resolve(__dirname, '../../packages/card-deck-core/src/index.ts'),
      '@games/card-deck-system': resolve(__dirname, '../../packages/card-deck-system/src/index.ts'),
      '@games/common': resolve(__dirname, '../../packages/common/src/index.ts'),
      '@games/domain-shared': resolve(__dirname, '../../packages/domain-shared/src/index.ts'),
      '@games/shared-api-client': resolve(__dirname, '../../packages/shared-api-client/src/index.ts'),
      '@games/shared-config': resolve(__dirname, '../../packages/shared-config/src/index.ts'),
      '@games/shared-hooks': resolve(__dirname, '../../packages/shared-hooks/src/index.ts'),
      '@games/shared-sanitizers': resolve(__dirname, '../../packages/shared-sanitizers/src/index.ts'),
      '@games/shared-validators': resolve(__dirname, '../../packages/shared-validators/src/index.ts'),
      '@games/sound-context': resolve(__dirname, '../../packages/sound-context/src/index.ts'),
      '@games/storage-utils': resolve(__dirname, '../../packages/storage-utils/src/index.ts'),
      '@games/theme-context': resolve(__dirname, '../../packages/theme-context/src/index.ts'),
    },
  },
  build: {
    target: 'es2020',
    cssTarget: 'es2020',
    modulePreload: { polyfill: false },
    minify: 'esbuild',
    cssMinify: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      host: 'localhost',
      port: 5173,
    },
  },
})
