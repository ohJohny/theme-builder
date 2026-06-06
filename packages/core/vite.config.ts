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
			entry: {
				index: path.resolve(here, 'src/index.ts'),
				'build-utils': path.resolve(here, 'src/build-utils.ts'),
				'cli/index': path.resolve(here, 'src/cli/index.ts'),
			},
			formats: ['es'],
			fileName: (_format, entryName) => `${entryName}.js`,
		},
		rolldownOptions: {
			external: (id) => id.startsWith('node:') || id === 'tsx' || id.startsWith('tsx/'),
		},
	},
});
