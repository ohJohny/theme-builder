import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	build: {
		outDir: path.resolve(here, 'dist'),
		emptyOutDir: true,
		lib: {
			entry: path.resolve(here, 'src/index.ts'),
			formats: ['es'],
			fileName: 'index',
		},
		rolldownOptions: {
			external: [],
		},
	},
});
