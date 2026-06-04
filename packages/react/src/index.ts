export { ThemeProvider, useTheme, useColorSchemeContext } from './ColorSchemeContext';
export type { ThemeProviderProps, ColorSchemeContextValue } from './ColorSchemeContext';
export { useColorScheme } from './useColorScheme';
export { useColorSchemeTogglePosition } from './useColorSchemeTogglePosition';

export {
	ThemeBuilder,
	RawThemeBuilder,
	buildThemeRaw,
	mergeTheme,
	applyColorScheme,
	createColorSchemeStore,
	resolveUtilityClass,
	UTILITY_CLASS_MAP,
	DEFAULT_THEME_META,
	startColorSchemeViewTransition,
	updateColorSchemeTogglePosition,
} from '@ohJohny/theme-builder-core';

export type {
	Theme,
	ColorSchemeId,
	ThemeMetaItem,
	ThemeStorageConfig,
	ThemeExtension,
	DeepPartial,
} from '@ohJohny/theme-builder-core';
