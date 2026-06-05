export { ThemeProvider, type ThemeProviderProps } from './components/ThemeProvider';
export { useTheme, getDefaultTheme, ThemeContext } from './components/useTheme';
export type { Theme } from './components/useTheme';
export { useColorScheme } from './components/useColorScheme';
export { useColorSchemeContext } from './components/ColorSchemeContext';
export type { ColorSchemeListItem, ColorSchemeContextValue } from './components/ColorSchemeContext';
export { useColorSchemeTogglePosition } from './components/useColorSchemeTogglePosition';
export { useUtilityClasses } from './components/useUtilityClasses';

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
