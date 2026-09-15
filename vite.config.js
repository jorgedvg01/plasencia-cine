import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { cpSync, mkdirSync } from 'node:fs';

function copyRuntimeContent() {
  return {
    name: 'copy-plasencia-runtime-content',
    closeBundle() {
      const output = resolve(import.meta.dirname, 'dist');
      const copies = [
        ['data/chapters.json', 'data/chapters.json'],
        ['data/media.json', 'data/media.json'],
        ['data/sources.json', 'data/sources.json'],
        ['assets/historia', 'assets/historia'],
        ['vendor', 'vendor'],
        ['documentacion/MATRIZ_24_TRATAMIENTOS.md', 'documentacion/MATRIZ_24_TRATAMIENTOS.md']
      ];
      for (const [source, target] of copies) {
        const destination = resolve(output, target);
        mkdirSync(resolve(destination, '..'), { recursive: true });
        cpSync(resolve(import.meta.dirname, source), destination, { recursive: true });
      }
    }
  };
}

export default defineConfig({
  appType: 'mpa',
  plugins: [copyRuntimeContent()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, 'index.html'),
        atlas: resolve(import.meta.dirname, '01-atlas.html'),
        cronologia: resolve(import.meta.dirname, '02-cronologia.html'),
        reescritura: resolve(import.meta.dirname, '03-reescritura.html'),
        creditos: resolve(import.meta.dirname, 'creditos.html')
      }
    }
  }
});
