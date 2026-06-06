import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { register } from 'tsx/esm/api';

import { generateThemeArtifacts } from '../config/generateThemeArtifacts.js';
import type { GenerateThemeArtifactsOptions } from '../config/generateThemeArtifacts.js';
import type { ThemeConfigInput } from '../config/types.js';
import type { GenerateCliConfig } from './resolveGenerateCliConfig.js';

type ThemeConfigModule = {
	readonly themeConfig?: ThemeConfigInput;
	readonly themeHashedOptions?: Partial<
		Pick<
			GenerateThemeArtifactsOptions,
			'utilityClassHashSalt' | 'utilityClassHashPrefix' | 'defaultScheme'
		>
	>;
};

let tsxRegistered = false;

function ensureTsxRegistered(): void {
	if (!tsxRegistered) {
		register();
		tsxRegistered = true;
	}
}

function assertWritableOutDir(outDir: string, force: boolean): void {
	const cssPath = path.join(outDir, 'theme.css');
	if (fs.existsSync(cssPath) && !force) {
		throw new Error(
			`File exists: ${cssPath}. Use --force to overwrite generated theme artifacts.`,
		);
	}
}

async function loadThemeConfigModule(configPath: string): Promise<ThemeConfigModule> {
	ensureTsxRegistered();
	const resolved = path.resolve(configPath);
	const mod = (await import(pathToFileURL(resolved).href)) as ThemeConfigModule;
	return mod;
}

export async function runGenerateThemeCli(config: GenerateCliConfig): Promise<{
	readonly cssPath: string;
	readonly mapPath: string;
	readonly breakpointsPath?: string;
}> {
	if (!fs.existsSync(config.configPath)) {
		throw new Error(`Theme config not found: ${config.configPath}`);
	}

	assertWritableOutDir(config.outDir, config.force);

	const mod = await loadThemeConfigModule(config.configPath);
	if (mod.themeConfig === undefined) {
		throw new Error(
			`Theme config module must export \`themeConfig\`: ${config.configPath}`,
		);
	}

	const result = await generateThemeArtifacts(mod.themeConfig, {
		mode: config.mode,
		outDir: config.outDir,
		defaultScheme: config.defaultScheme ?? mod.themeHashedOptions?.defaultScheme,
		utilityClassHashSalt:
			config.utilityClassHashSalt ?? mod.themeHashedOptions?.utilityClassHashSalt,
		utilityClassHashPrefix:
			config.utilityClassHashPrefix ?? mod.themeHashedOptions?.utilityClassHashPrefix,
	});

	return result;
}
