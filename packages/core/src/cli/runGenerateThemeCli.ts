import fs from 'node:fs';
import path from 'node:path';

import { loadThemeConfigModule } from '../config/loadThemeConfig.js';
import { generateThemeArtifacts } from '../config/generateThemeArtifacts.js';
import type { GenerateCliConfig } from './resolveGenerateCliConfig.js';

function assertWritableOutDir(outDir: string, force: boolean): void {
	const cssPath = path.join(outDir, 'theme.css');
	if (fs.existsSync(cssPath) && !force) {
		throw new Error(
			`File exists: ${cssPath}. Use --force to overwrite generated theme artifacts.`,
		);
	}
}

export async function runGenerateThemeCli(config: GenerateCliConfig): Promise<{
	readonly cssPath: string;
	readonly mapPath: string;
	readonly breakpointsPath?: string;
	readonly initScriptPath?: string;
	readonly initScriptHtmlPath?: string;
	readonly designTokensPath?: string;
}> {
	if (!fs.existsSync(config.configPath)) {
		throw new Error(`Theme config not found: ${config.configPath}`);
	}

	assertWritableOutDir(config.outDir, config.force);

	const mod = await loadThemeConfigModule(config.configPath);
	if (mod.themeConfig === undefined) {
		throw new Error(`Theme config module must export \`themeConfig\`: ${config.configPath}`);
	}

	const initScript =
		config.initScriptStorage !== undefined
			? {
					storage: config.initScriptStorage,
					schemes: mod.themeConfig.schemes,
					defaultScheme:
						config.defaultScheme ??
						mod.themeHashedOptions?.defaultScheme ??
						mod.themeConfig.schemes?.[0],
				}
			: mod.themeInitOptions;

	const result = await generateThemeArtifacts(mod.themeConfig, {
		mode: config.mode,
		outDir: config.outDir,
		defaultScheme: config.defaultScheme ?? mod.themeHashedOptions?.defaultScheme,
		utilityClassHashSalt:
			config.utilityClassHashSalt ?? mod.themeHashedOptions?.utilityClassHashSalt,
		utilityClassHashPrefix:
			config.utilityClassHashPrefix ?? mod.themeHashedOptions?.utilityClassHashPrefix,
		initScript,
		exportDtcg: config.exportDtcg,
		lintA11y: config.lintA11y,
		strictA11y: config.strictA11y,
	});

	return result;
}
