import path from 'node:path';
import type { Plugin } from 'vite';

import { runGenerateThemeCli } from './cli/runGenerateThemeCli.js';
import { resolveGenerateCliConfig } from './cli/resolveGenerateCliConfig.js';
import type { GenerateCliConfig } from './cli/resolveGenerateCliConfig.js';

export type ThemeBuilderVitePluginOptions = {
	readonly configPath?: string;
	readonly outDir?: string;
	readonly mode?: 'identity' | 'hashed';
	readonly defaultScheme?: string;
	readonly storageKey?: string;
	readonly storageType?: 'localStorage' | 'cookie';
	readonly exportDtcg?: boolean;
	/** Contrast warnings for semantic text/surface pairs (default `true`). */
	readonly lintA11y?: boolean;
	/** Fail the build on contrast failures (default `false`). */
	readonly strictA11y?: boolean;
};

function resolvePluginGenerateConfig(
	options: ThemeBuilderVitePluginOptions,
	projectRoot: string,
): GenerateCliConfig {
	const base = resolveGenerateCliConfig(projectRoot);
	return {
		...base,
		configPath: options.configPath
			? path.resolve(projectRoot, options.configPath)
			: base.configPath,
		outDir: options.outDir ? path.resolve(projectRoot, options.outDir) : base.outDir,
		mode: options.mode ?? base.mode,
		defaultScheme: options.defaultScheme,
		force: true,
		initScriptStorage:
			options.storageKey && options.storageType
				? { type: options.storageType, key: options.storageKey }
				: base.initScriptStorage,
		exportDtcg: options.exportDtcg ?? false,
		lintA11y: options.lintA11y ?? true,
		strictA11y: options.strictA11y ?? false,
		watch: false,
	};
}

export function themeBuilder(options: ThemeBuilderVitePluginOptions = {}): Plugin {
	let projectRoot = process.cwd();

	return {
		name: 'theme-builder',
		configResolved(config) {
			projectRoot = config.root;
		},
		async buildStart() {
			await runGenerateThemeCli(resolvePluginGenerateConfig(options, projectRoot));
		},
		async watchChange(file) {
			const generateConfig = resolvePluginGenerateConfig(options, projectRoot);
			if (path.resolve(file) !== path.resolve(generateConfig.configPath)) {
				return;
			}
			await runGenerateThemeCli(generateConfig);
		},
	};
}
