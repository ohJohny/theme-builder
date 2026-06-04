export { ThemeProvider, type ThemeProviderProps } from './ThemeProvider';
export { useTheme, getDefaultTheme, ThemeContext } from './useTheme';
export type { Theme } from './useTheme';
export { useColorScheme } from './useColorScheme';
export { useColorSchemeContext } from './ColorSchemeContext';
export type { ColorSchemeListItem, ColorSchemeContextValue } from './ColorSchemeContext';
export { useColorSchemeTogglePosition } from './useColorSchemeTogglePosition';
export { useUtilityClasses } from './useUtilityClasses';
export type { UtilityClassesResult, UtilityProps } from './useUtilityClasses';

export {
	ThemeBuilder,
	RawThemeBuilder,
	buildThemeRaw,
	mergeTheme,
	applyColorScheme,
	createColorSchemeStore,
	resolveUtilityClass,
	resolveUtilityClasses,
	UTILITY_CLASS_MAP,
	UTILITY_CLASS_NAMES,
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
	UtilityProps,
	UtilityClassesResult,
	ThemeColorOverrides,
	SemanticColorTokenOverrides,
} from '@ohJohny/theme-builder-core';
