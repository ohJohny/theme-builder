import { buildThemeFromConfig } from './buildThemeFromConfig';
import { buildThemeCss } from './buildThemeCss';
import { resolveDefaultScheme, resolveSchemes } from './buildThemeStylesheet';
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
	const { css, classMap } = buildThemeCss(config, {
		mode,
		defaultScheme,
		schemes,
		utilityClassHashSalt: options.utilityClassHashSalt,
		utilityClassHashPrefix: options.utilityClassHashPrefix,
	});
	const theme = buildThemeFromConfig(config, classMap);

	if (options.inject) {
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
