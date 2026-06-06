import {
	buildThemeStylesheet,
	createTheme,
	defineThemeConfig,
	injectThemeStyles,
	type CreatedTheme,
	type ThemeConfigInput,
} from '@ohJohny/theme-builder/core';

const INJECT_ID = 'playground-theme-styles';

export function createPlaygroundTheme(raw: unknown): CreatedTheme<ThemeConfigInput> {
	const config = defineThemeConfig(raw as ThemeConfigInput);
	const created = createTheme(config, {
		mode: 'identity',
		inject: false,
		defaultScheme: config.schemes?.[0],
	});
	const css = buildThemeStylesheet(config, {
		defaultScheme: created.defaultScheme,
		schemes: created.schemes,
	});
	injectThemeStyles(css, INJECT_ID);
	return created;
}
