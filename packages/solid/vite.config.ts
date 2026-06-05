import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../..');
const outDir = path.join(repoRoot, 'dist', 'solid');

export default defineConfig({
	plugins: [solid()],
	build: {
		outDir,
		emptyOutDir: false,
		lib: {
			entry: path.resolve(here, 'src/index.ts'),
			formats: ['es'],
			fileName: 'index',
		},
		rolldownOptions: {
			external: ['solid-js', 'solid-js/web', '@ohJohny/theme-builder-core'],
			output: {
				paths: {
					'@ohJohny/theme-builder-core': '../core/index.js',
				},
			},
		},
	},
});
