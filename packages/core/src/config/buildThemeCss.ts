import { rewriteUtilityCss } from '../utils/utility-class-map';
import { buildThemeStylesheet } from './buildThemeStylesheet';
import { buildThemeClassMap } from './collectClassNames';
import type { ThemeConfigInput, UtilityClassMapMode } from './types';

export type BuildThemeCssOptions = {
	readonly mode: UtilityClassMapMode;
	readonly defaultScheme: string;
	readonly schemes: readonly string[];
	readonly utilityClassHashSalt?: string;
	readonly utilityClassHashPrefix?: string;
};

export function buildThemeCss(
	config: ThemeConfigInput,
	options: BuildThemeCssOptions,
): { readonly css: string; readonly classMap: Readonly<Record<string, string>> } {
	const classMap = buildThemeClassMap(
		config,
		options.mode,
		options.utilityClassHashSalt,
		options.utilityClassHashPrefix,
	);

	let css = buildThemeStylesheet(config, {
		defaultScheme: options.defaultScheme,
		schemes: options.schemes,
	});

	if (options.mode === 'hashed') {
		css = rewriteUtilityCss(css, classMap);
	}

	return { css, classMap };
}
