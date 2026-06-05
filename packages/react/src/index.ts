export { ThemeProvider } from './components/ThemeProvider';
export type { ThemeProviderProps } from './components/ThemeProvider';
export { useTheme, useColorSchemeContext } from './components/ColorSchemeContext';
export type { ColorSchemeContextValue } from './components/ColorSchemeContext';
export { useColorScheme } from './components/useColorScheme';
export { useColorSchemeTogglePosition } from './components/useColorSchemeTogglePosition';
export { useUtilityClasses } from './components/useUtilityClasses';
export { DeviceSizeProvider } from './components/DeviceSizeProvider';
export type { DeviceSizeProviderProps } from './components/DeviceSizeProvider';
export { useDeviceSize } from './components/useDeviceSize';
export { DEFAULT_DEVICE_BREAKPOINTS_REM } from './utils/deviceSizeCore';
export type {
	DeviceSizeName,
	DeviceMatches,
	DeviceBreakpointsRem,
	UseDeviceSizeOptions,
} from './utils/types';

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
