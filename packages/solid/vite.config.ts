import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [solid()],
	build: {
		outDir: path.resolve(here, 'dist'),
		emptyOutDir: true,
		lib: {
			entry: path.resolve(here, 'src/index.ts'),
			formats: ['es'],
			fileName: 'index',
		},
		rolldownOptions: {
			external: ['solid-js', 'solid-js/web', '@ohJohny/theme-builder-core'],
		},
	},
});
