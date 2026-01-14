import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import pkg from './package.json' with { type: 'json' };

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    publicDir: false,
    plugins: [
      react(),
      cssInjectedByJsPlugin(),
    ],
    build: {
      lib: {
        entry: 'src/main.tsx',
        name: pkg.name.replaceAll('-', '_'),
        formats: ['iife'],
        fileName: () => `${pkg.name}.bundle.js`
      },
      assetsInlineLimit: Number.MAX_SAFE_INTEGER,
      rollupOptions: {
        output: {
          manualChunks: undefined,
          inlineDynamicImports: true,
        },
      },
      license: {
        fileName: 'licenses.txt',
      },
      sourcemap: !isProd,
      minify: isProd ? 'esbuild' : false,
    },
    esbuild: {
      keepNames: true,
      legalComments: isProd ? 'none' : 'inline',
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
      'process.env': '{}',
    },
  };
});
