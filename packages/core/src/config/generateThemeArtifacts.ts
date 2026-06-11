import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
	buildColorSchemeInitScript,
	buildColorSchemeInitScriptHtmlSnippet,
} from '../buildColorSchemeInitScript';
import type { ThemeStorageConfig } from '../colorScheme.types';
import { exportDesignTokens } from '../exportDesignTokens';
import { lintThemeContrast } from '../lintThemeContrast';
import { rewriteUtilityCss } from '../utils/utility-class-map';
import { buildBreakpointsScss } from './buildBreakpointsScss';
import {
	buildThemeStylesheet,
	resolveDefaultScheme,
	resolveSchemes,
} from './buildThemeStylesheet';
import { buildThemeClassMap, collectClassNames } from './collectClassNames';
import type { ThemeConfigInput, UtilityClassMapMode } from './types';

export type ColorSchemeInitScriptOptions = {
	readonly storage: ThemeStorageConfig;
};

export type GenerateThemeArtifactsOptions = {
	readonly mode: UtilityClassMapMode;
	readonly outDir: string;
	readonly defaultScheme?: string;
	/** Salt for hashed utility class names; defaults to `UTILITY_CLASS_HASH_SALT`. */
	readonly utilityClassHashSalt?: string;
	/** Prefix for hashed utility class names; defaults to `UTILITY_CLASS_HASH_PREFIX`. */
	readonly utilityClassHashPrefix?: string;
	/** When set, writes `theme-init.js` and `theme-init.html` anti-FOUC artifacts. */
	readonly initScript?: ColorSchemeInitScriptOptions;
	/** When true, writes `design-tokens.json` (W3C DTCG format). */
	readonly exportDtcg?: boolean;
	/** Logs contrast warnings for semantic text/surface pairs (default `true`). */
	readonly lintA11y?: boolean;
	/** When true, throws on contrast failures instead of warning (default `false`). */
	readonly strictA11y?: boolean;
};

function assertOutDir(outDir: string | undefined): string {
	if (outDir === undefined || outDir.trim().length === 0) {
		throw new Error(
			'[generateThemeArtifacts] outDir is required (pass an explicit output directory)',
		);
	}
	return outDir;
}

export async function generateThemeArtifacts(
	config: ThemeConfigInput,
	options: GenerateThemeArtifactsOptions,
): Promise<{
	readonly cssPath: string;
	readonly mapPath: string;
	readonly breakpointsPath?: string;
	readonly initScriptPath?: string;
	readonly initScriptHtmlPath?: string;
	readonly designTokensPath?: string;
}> {
	const outDir = assertOutDir(options.outDir);
	const schemes = resolveSchemes(config);
	const defaultScheme = resolveDefaultScheme(config, options.defaultScheme);
	const classMap = buildThemeClassMap(
		config,
		options.mode,
		options.utilityClassHashSalt,
		options.utilityClassHashPrefix,
	);

	let css = buildThemeStylesheet(config, { defaultScheme, schemes });
	if (options.mode === 'hashed') {
		css = rewriteUtilityCss(css, classMap);
	}

	await mkdir(outDir, { recursive: true });

	const cssPath = path.join(outDir, 'theme.css');
	await writeFile(cssPath, css, 'utf-8');

	const catalog = collectClassNames(config);
	const mapPath = path.join(outDir, 'utility-class-map.json');
	await writeFile(mapPath, JSON.stringify({ mode: options.mode, map: classMap, catalog }, null, 2), 'utf-8');

	const breakpointsScss = buildBreakpointsScss(config);
	let breakpointsPath: string | undefined;
	if (breakpointsScss !== undefined) {
		breakpointsPath = path.join(outDir, '_breakpoints.scss');
		await writeFile(breakpointsPath, breakpointsScss, 'utf-8');
	}

	let initScriptPath: string | undefined;
	let initScriptHtmlPath: string | undefined;
	if (options.initScript !== undefined) {
		const initScript = buildColorSchemeInitScript({
			schemes,
			defaultScheme,
			storage: options.initScript.storage,
		});
		initScriptPath = path.join(outDir, 'theme-init.js');
		await writeFile(initScriptPath, initScript, 'utf-8');

		const snippet = buildColorSchemeInitScriptHtmlSnippet('theme-init.js');
		initScriptHtmlPath = path.join(outDir, 'theme-init.html');
		await writeFile(initScriptHtmlPath, `${snippet}\n`, 'utf-8');
	}

	let designTokensPath: string | undefined;
	if (options.exportDtcg) {
		designTokensPath = path.join(outDir, 'design-tokens.json');
		await writeFile(
			designTokensPath,
			JSON.stringify(exportDesignTokens(config), null, 2),
			'utf-8',
		);
	}

	const lintA11y = options.lintA11y ?? true;
	const strictA11y = options.strictA11y ?? false;
	if (lintA11y) {
		const warnings = lintThemeContrast(config);
		for (const warning of warnings) {
			const message = `[theme-builder a11y] ${warning.scheme} ${warning.token}: contrast ${warning.ratio.toFixed(2)} (min 4.5)`;
			if (strictA11y) {
				throw new Error(message);
			}
			console.warn(message);
		}
	}

	return {
		cssPath,
		mapPath,
		breakpointsPath,
		initScriptPath,
		initScriptHtmlPath,
		designTokensPath,
	};
}
