import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    root: 'web', // dossier d’entrée
    publicDir: '../web',
    resolve: {
        alias: {
            '@modernik/react-mlm-tree-view': path.resolve(__dirname, './src'),
        },
    },
});
