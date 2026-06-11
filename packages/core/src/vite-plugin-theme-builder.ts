import path from 'node:path';
import type { Plugin } from 'vite';

import { loadThemeConfigModule } from './config/loadThemeConfig.js';
import { generateThemeArtifacts } from './config/generateThemeArtifacts.js';
import type { ColorSchemeInitScriptOptions } from './config/generateThemeArtifacts.js';
import { resolveThemeConfigPath } from './config/resolveThemeConfigPath.js';
import type { UtilityClassMapMode } from './config/types.js';

export type ThemeBuilderVitePluginOptions = {
	readonly configPath?: string;
	readonly outDir?: string;
	readonly mode?: UtilityClassMapMode;
	readonly defaultScheme?: string;
	readonly storageKey?: string;
	readonly storageType?: 'localStorage' | 'cookie';
	readonly exportDtcg?: boolean;
	/** Contrast warnings for semantic text/surface pairs (default `true`). */
	readonly lintA11y?: boolean;
	/** Fail the build on contrast failures (default `false`). */
	readonly strictA11y?: boolean;
};

function resolvePluginOutDir(projectRoot: string, outDir?: string): string {
	const value = outDir ?? 'src/generated';
	return path.isAbsolute(value) ? value : path.resolve(projectRoot, value);
}

function resolveInitScript(
	options: ThemeBuilderVitePluginOptions,
	modInit?: ColorSchemeInitScriptOptions,
): ColorSchemeInitScriptOptions | undefined {
	if (options.storageKey && options.storageType) {
		return { storage: { type: options.storageType, key: options.storageKey } };
	}
	return modInit;
}

export function themeBuilder(options: ThemeBuilderVitePluginOptions = {}): Plugin {
	let projectRoot = process.cwd();

	return {
		name: 'theme-builder',
		configResolved(config) {
			projectRoot = config.root;
		},
		async buildStart() {
			const configPath = resolveThemeConfigPath(projectRoot, options.configPath);
			const mod = await loadThemeConfigModule(configPath);
			if (mod.themeConfig === undefined) {
				throw new Error(`Theme config module must export \`themeConfig\`: ${configPath}`);
			}

			await generateThemeArtifacts(mod.themeConfig, {
				mode: options.mode ?? 'hashed',
				outDir: resolvePluginOutDir(projectRoot, options.outDir),
				defaultScheme: options.defaultScheme ?? mod.themeHashedOptions?.defaultScheme,
				utilityClassHashSalt: mod.themeHashedOptions?.utilityClassHashSalt,
				utilityClassHashPrefix: mod.themeHashedOptions?.utilityClassHashPrefix,
				initScript: resolveInitScript(options, mod.themeInitOptions),
				exportDtcg: options.exportDtcg ?? false,
				lintA11y: options.lintA11y ?? true,
				strictA11y: options.strictA11y ?? false,
			});
		},
		async watchChange(file) {
			const configPath = resolveThemeConfigPath(projectRoot, options.configPath);
			if (path.resolve(file) !== path.resolve(configPath)) {
				return;
			}

			const mod = await loadThemeConfigModule(configPath);
			if (mod.themeConfig === undefined) {
				return;
			}

			await generateThemeArtifacts(mod.themeConfig, {
				mode: options.mode ?? 'hashed',
				outDir: resolvePluginOutDir(projectRoot, options.outDir),
				defaultScheme: options.defaultScheme ?? mod.themeHashedOptions?.defaultScheme,
				utilityClassHashSalt: mod.themeHashedOptions?.utilityClassHashSalt,
				utilityClassHashPrefix: mod.themeHashedOptions?.utilityClassHashPrefix,
				initScript: resolveInitScript(options, mod.themeInitOptions),
				exportDtcg: options.exportDtcg ?? false,
				lintA11y: options.lintA11y ?? true,
				strictA11y: options.strictA11y ?? false,
			});
		},
	};
}
