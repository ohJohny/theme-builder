import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../..');
const outDir = path.join(repoRoot, 'dist', 'core', 'cli');

function isExternal(id: string): boolean {
	return id.startsWith('node:') || id === 'tsx' || id.startsWith('tsx/');
}

export default defineConfig({
	build: {
		ssr: true,
		target: 'node20',
		outDir,
		emptyOutDir: true,
		rollupOptions: {
			input: path.resolve(here, 'src/cli/generate.ts'),
			external: isExternal,
			treeshake: true,
			output: {
				format: 'es',
				entryFileNames: 'generate.js',
				banner: '#!/usr/bin/env node',
			},
		},
	},
});
