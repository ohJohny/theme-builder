import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolveGenerateCliConfig } from './resolveGenerateCliConfig.js';
import { runGenerateThemeCli } from './runGenerateThemeCli.js';

async function main(): Promise<void> {
	const config = resolveGenerateCliConfig();
	const result = await runGenerateThemeCli(config);
	const relativeCss = path.relative(config.cwd, result.cssPath);
	console.log(`theme-builder generate: wrote ${relativeCss}`);
	if (result.breakpointsPath !== undefined) {
		console.log(`theme-builder generate: wrote ${path.relative(config.cwd, result.breakpointsPath)}`);
	}
}

const isMain =
	process.argv[1] != null &&
	path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
	main().catch((error: unknown) => {
		console.error(error instanceof Error ? error.message : error);
		process.exit(1);
	});
}
