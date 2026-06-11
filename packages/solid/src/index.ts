export { ThemeProvider, type ThemeProviderProps } from './components/ThemeProvider';
export { SingletonThemeProvider, type SingletonThemeProviderProps } from './components/SingletonThemeProvider';
export { createThemeContext } from './components/createThemeContext';
export { useTheme, ThemeContext } from './components/useTheme';
export type { Theme } from './components/useTheme';
export { useColorScheme } from './components/useColorScheme';
export { useColorSchemeContext } from './components/ColorSchemeContext';
export type { ColorSchemeListItem, ColorSchemeContextValue } from './components/ColorSchemeContext';
export { useColorSchemeTogglePosition } from './components/useColorSchemeTogglePosition';
export { useUtilityClasses } from './components/useUtilityClasses';
export { DeviceSizeProvider } from './components/DeviceSizeProvider';
export type { DeviceSizeProviderProps } from './components/DeviceSizeProvider';
export { useDeviceSize } from './components/useDeviceSize';
export type { UseDeviceSizeResult } from './components/useDeviceSize';
export { useReducedMotion } from './components/useReducedMotion';
export { useReducedMotionContext } from './components/ReducedMotionContext';
export type { ReducedMotionContextValue } from './components/ReducedMotionContext';
export { DeviceMatch } from './components/DeviceMatch';
export type { DeviceMatchProps } from './components/DeviceMatch';
export {
	DEFAULT_DEVICE_BREAKPOINTS,
	DEFAULT_DEVICE_BREAKPOINTS_REM,
} from './utils/deviceSizeCore';
export type {
	DeviceSizeName,
	DeviceMatches,
	DeviceBreakpoints,
	DeviceBreakpointsRem,
	UseDeviceSizeOptions,
} from './utils/types';
export type { RemLength } from '@ohJohny/theme-builder-core';
export { remLengthToPx, formatRemCss, parseRemValue, isRemLength } from '@ohJohny/theme-builder-core';

export {
	defineThemeConfig,
	createTheme,
	applyColorScheme,
	createColorSchemeStore,
	peekOrCreateSharedColorSchemeStore,
	retainSharedColorSchemeStore,
	releaseSharedColorSchemeStore,
	resetSharedColorSchemeStoreForTests,
	resolveUtilityClasses,
	DEFAULT_THEME_META,
	DEFAULT_SCHEMES,
	startColorSchemeViewTransition,
	updateColorSchemeTogglePosition,
	subscribeReducedMotion,
	getReducedMotionSnapshot,
	applyReducedMotion,
	AUTO_REDUCED_MOTION,
	resolveReducedMotion,
} from '@ohJohny/theme-builder-core';

export type {
	CreatedTheme,
	ThemeConfigInput,
	SchemeName,
	ColorSchemeId,
	ThemeMetaItem,
	ThemeStorageConfig,
	UtilityProps,
	ReducedMotionPreference,
	UtilityClassesResult,
	CreateThemeOptions,
} from '@ohJohny/theme-builder-core';
