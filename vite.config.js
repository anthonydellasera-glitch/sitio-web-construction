import { defineConfig } from 'vite';

export default defineConfig({
  // El sitio se sirve desde la raiz del dominio.
  // Si lo publicas en GitHub Pages bajo un subdirectorio, cambia esto a
  // '/ap-servicios-web/' y vuelve a compilar.
  base: '/',

  // Todo lo que hay en public/ se copia tal cual a dist/, conservando rutas.
  // Por eso el HTML y el CSS referencian las imagenes como /img/...
  publicDir: 'public',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Las fotos ya vienen optimizadas; no conviene convertirlas a base64.
    assetsInlineLimit: 0,
    cssMinify: true,
    // Util para rastrear que genero cada archivo del bundle.
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  },

  server: {
    port: 5173,
    open: true
  }
});
