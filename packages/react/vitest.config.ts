import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const coreSrc = path.join(fileURLToPath(new URL('.', import.meta.url)), '../core/src/index.ts');

export default defineConfig({
	resolve: {
		alias: {
			'@ohJohny/theme-builder-core': coreSrc,
		},
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.ts'],
		include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
	},
});
