import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../..');
const outDir = path.join(repoRoot, 'dist', 'core');

export default defineConfig({
	build: {
		outDir,
		emptyOutDir: false,
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
