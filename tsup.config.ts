import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    esbuildOptions(options) {
        options.loader = {
            ...options.loader,
            '.scss': 'empty', // ignore les .scss pendant le build
        }
    },
    target: 'es2020',
    jsxFactory: 'transform' // ou 'preserve' selon le besoin
});
