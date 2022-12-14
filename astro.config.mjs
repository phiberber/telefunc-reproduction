import { defineConfig } from 'astro/config';
import { telefunc } from 'telefunc/vite'

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [telefunc()],
        build: { target: 'esnext' },
        appType: 'mpa',
    }
});