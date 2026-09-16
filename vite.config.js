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
        ['vendor', 'vendor']
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
        creditos: resolve(import.meta.dirname, 'creditos.html')
      }
    }
  }
});
