export { ThemeProvider, type ThemeProviderProps } from './ThemeProvider';
export { useTheme, getDefaultTheme, ThemeContext } from './useTheme';
export type { Theme } from './useTheme';
export { useColorScheme } from './useColorScheme';
export { useColorSchemeContext } from './ColorSchemeContext';
export type { ColorSchemeListItem, ColorSchemeContextValue } from './ColorSchemeContext';
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
	ColorSchemeId,
	ThemeMetaItem,
	ThemeStorageConfig,
	ThemeExtension,
	DeepPartial,
} from '@ohJohny/theme-builder-core';
