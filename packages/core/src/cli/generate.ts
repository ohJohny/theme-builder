import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolveGenerateCliConfig } from './resolveGenerateCliConfig.js';
import { runGenerateThemeCli } from './runGenerateThemeCli.js';

async function runOnce(): Promise<void> {
	const config = resolveGenerateCliConfig();
	const result = await runGenerateThemeCli(config);
	const relativeCss = path.relative(config.cwd, result.cssPath);
	console.log(`theme-builder generate: wrote ${relativeCss}`);
	if (result.breakpointsPath !== undefined) {
		console.log(`theme-builder generate: wrote ${path.relative(config.cwd, result.breakpointsPath)}`);
	}
	if (result.initScriptPath !== undefined) {
		console.log(`theme-builder generate: wrote ${path.relative(config.cwd, result.initScriptPath)}`);
	}
	if (result.designTokensPath !== undefined) {
		console.log(
			`theme-builder generate: wrote ${path.relative(config.cwd, result.designTokensPath)}`,
		);
	}
}

async function runWatch(): Promise<void> {
	const config = resolveGenerateCliConfig();
	await runOnce();
	console.log(`theme-builder generate: watching ${path.relative(config.cwd, config.configPath)}`);

	fs.watch(config.configPath, { persistent: true }, () => {
		void runGenerateThemeCli({ ...config, force: true })
			.then(() => {
				console.log('theme-builder generate: regenerated theme artifacts');
			})
			.catch((error: unknown) => {
				console.error(error instanceof Error ? error.message : error);
			});
	});
}

async function main(): Promise<void> {
	const config = resolveGenerateCliConfig();
	if (config.watch) {
		await runWatch();
		return;
	}
	await runOnce();
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
