import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ command, mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '')
  
  const isDev = command === 'serve'
  const isProd = command === 'build'

  return {
    // Relative base path for dist/ (works with Electron & Capacitor)
    base: './',

    // Environment variables handling
    define: {
      '__DEV__': isDev,
      '__PROD__': isProd,
    },

    plugins: [
      // React Fast Refresh
      react({
        jsxRuntime: 'automatic',
      }),

      // Bundle analysis for production builds
      isProd &&
        visualizer({
          filename: 'dist/bundle-report.html',
          title: 'Lights Out - Bundle Report',
          gzipSize: true,
          brotliSize: true,
          open: false,
        }),
    ].filter(Boolean),

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@/domain': path.resolve(__dirname, 'src/domain'),
        '@/app': path.resolve(__dirname, 'src/app'),
        '@/ui': path.resolve(__dirname, 'src/ui'),
        '@/wasm': path.resolve(__dirname, 'src/wasm'),
        '@/workers': path.resolve(__dirname, 'src/workers'),
        '@/themes': path.resolve(__dirname, 'src/themes'),
      },
      // Ensure ES modules are properly resolved
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs'],
    },

    build: {
      target: 'es2020',
      cssTarget: 'es2020',
      
      // Minification
      minify: 'esbuild',
      cssMinify: true,
      
      // Source maps for production debugging
      sourcemap: isProd ? 'hidden' : false,
      
      // Preload optimization (disable for better control)
      modulePreload: { polyfill: false },

      // Output optimization
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,

      // Rollup options
      rollupOptions: {
        // Explicit manual chunks for better caching (Vite 8.0.0+ requires function)
        output: {
          manualChunks(id) {
            // React vendor chunk
            if (id.includes('node_modules/react')) {
              return 'vendor-react'
            }
            // Capacitor vendor chunk
            if (id.includes('node_modules/@capacitor')) {
              return 'vendor-capacitor'
            }
          },
          
          // Compact chunk naming for smaller hashes
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            // Handle cases where assetInfo.name might be undefined
            const name = assetInfo?.name || 'asset'
            const info = name.split('.')
            const ext = info[info.length - 1]
            
            // Categorize by file type
            if (/png|jpe?g|gif|svg|webp|ico/i.test(ext)) {
              return `images/[name]-[hash][extname]`
            } else if (/ttf|otf|woff2?|eot/i.test(ext)) {
              return `fonts/[name]-[hash][extname]`
            } else if (/css/i.test(ext)) {
              return `css/[name]-[hash][extname]`
            }
            // Default for other assets
            return `assets/[name]-[hash][extname]`
          },
        },
      },

      // Size warnings
      reportCompressedSize: true,
      
      // Chunk size warnings
      chunkSizeWarningLimit: 500,
    },

    // Development server
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      
      // Hot Module Replacement
      hmr: {
        host: 'localhost',
        port: 5173,
        protocol: 'ws',
      },

      // CORS & security for dev
      cors: true,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      },

      // Middleware for SPA routing
      middlewareMode: false,

      // Watch options
      watch: {
        // Ignore heavy directories
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/dist/**',
          '**/release/**',
          '**/build/**',
        ],
      },
    },

    // CSS handling
    css: {
      postcss: {
        plugins: [],
      },
    },

    // Preview server (for testing production builds locally)
    preview: {
      host: '0.0.0.0',
      port: 5174,
      strictPort: true,
      cors: true,
    },

    // Optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@capacitor/core',
      ],
      exclude: ['src'],
    },

    // Logging
    logLevel: isDev ? 'info' : 'warn',
  }
})
