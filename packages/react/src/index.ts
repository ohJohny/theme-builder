export { ThemeProvider } from './ThemeProvider';
export type { ThemeProviderProps } from './ThemeProvider';
export { useTheme, useColorSchemeContext } from './ColorSchemeContext';
export type { ColorSchemeContextValue } from './ColorSchemeContext';
export { useColorScheme } from './useColorScheme';
export { useColorSchemeTogglePosition } from './useColorSchemeTogglePosition';
export { useUtilityClasses } from './useUtilityClasses';

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
	Theme,
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
