import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { rewriteUtilityCss } from '../utils/utility-class-map';
import { buildBreakpointsScss } from './buildBreakpointsScss';
import {
	buildThemeStylesheet,
	resolveDefaultScheme,
	resolveSchemes,
} from './buildThemeStylesheet';
import { buildThemeClassMap, collectClassNames } from './collectClassNames';
import type { ThemeConfigInput, UtilityClassMapMode } from './types';

export type GenerateThemeArtifactsOptions = {
	readonly mode: UtilityClassMapMode;
	readonly outDir: string;
	readonly defaultScheme?: string;
	/** Salt for hashed utility class names; defaults to `UTILITY_CLASS_HASH_SALT`. */
	readonly utilityClassHashSalt?: string;
	/** Prefix for hashed utility class names; defaults to `UTILITY_CLASS_HASH_PREFIX`. */
	readonly utilityClassHashPrefix?: string;
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

	return { cssPath, mapPath, breakpointsPath };
}
