import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@ohJohny/theme-builder-core': path.resolve(
				__dirname,
				'../../packages/core/src/index.ts',
			),
			'@ohJohny/theme-builder/core': path.resolve(
				__dirname,
				'../../packages/core/src/index.ts',
			),
			'@ohJohny/theme-builder/react': path.resolve(
				__dirname,
				'../../packages/react/src/index.ts',
			),
		},
	},
	server: {
		port: 5173,
	},
});
