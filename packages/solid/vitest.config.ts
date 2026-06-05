import path from 'node:path';
import { fileURLToPath } from 'node:url';
import solid from 'vite-plugin-solid';
import { defineConfig } from 'vitest/config';

const here = path.dirname(fileURLToPath(import.meta.url));
const coreSrc = path.join(here, '../core/src/index.ts');

export default defineConfig({
	plugins: [solid({ hot: false })],
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
