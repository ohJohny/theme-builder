import { buildThemeFromConfig } from './buildThemeFromConfig';
import {
	buildThemeStylesheet,
	resolveDefaultScheme,
	resolveSchemes,
} from './buildThemeStylesheet';
import { buildThemeClassMap } from './collectClassNames';
import { injectThemeStyles } from './injectThemeStyles';
import type {
	CreateThemeOptions,
	CreatedTheme,
	SchemeName,
	ThemeConfigInput,
} from './types';

export function createTheme<const C extends ThemeConfigInput>(
	config: C,
	options: CreateThemeOptions<C> = {},
): CreatedTheme<C> {
	const mode = options.mode ?? 'identity';
	const schemes = resolveSchemes(config);
	const defaultScheme = resolveDefaultScheme(
		config,
		options.defaultScheme as string | undefined,
	);
	const classMap = buildThemeClassMap(config, mode, options.utilityClassHashSalt);
	const theme = buildThemeFromConfig(config, classMap);

	if (options.inject) {
		const css = buildThemeStylesheet(config, { defaultScheme, schemes });
		injectThemeStyles(css);
	}

	return {
		config,
		schemes,
		defaultScheme,
		theme,
		classMap,
		mode,
	} as CreatedTheme<C>;
}

export type { SchemeName };
