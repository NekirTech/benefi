import { readFile } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig, type Plugin } from 'vite';

const locales = fileURLToPath(new URL('./src/locales/', import.meta.url));

// In production the container serves /data/ from the volume the menu
// converter writes to. During `npm run dev` we serve src/locales instead.
function devMenuData(): Plugin {
  return {
    name: 'dev-menu-data',
    configureServer(server) {
      server.middlewares.use('/data', async (req, res, next) => {
        const file = (req.url ?? '').replace(/^\//, '').split('?')[0];
        if (!/^menu(_\w+)?\.json$/.test(file)) return next();
        try {
          res.setHeader('Content-Type', 'application/json');
          res.end(await readFile(locales + file));
        } catch {
          next();
        }
      });
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [vue(), devMenuData()],
  resolve: {
    alias: { src: fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // The server build is only used by scripts/prerender.js.
  build: isSsrBuild
    ? { outDir: 'dist-ssr' }
    : { outDir: 'dist', ssrManifest: true },
}));
