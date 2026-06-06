export { ThemeProvider } from './components/ThemeProvider';
export type { ThemeProviderProps } from './components/ThemeProvider';
export { createThemeContext } from './components/createThemeContext';
export { useTheme, useColorSchemeContext } from './components/ColorSchemeContext';
export type { ColorSchemeContextValue } from './components/ColorSchemeContext';
export { useColorScheme } from './components/useColorScheme';
export { useColorSchemeTogglePosition } from './components/useColorSchemeTogglePosition';
export { useUtilityClasses } from './components/useUtilityClasses';
export { DeviceSizeProvider } from './components/DeviceSizeProvider';
export type { DeviceSizeProviderProps } from './components/DeviceSizeProvider';
export { useDeviceSize } from './components/useDeviceSize';
export { DeviceMatch } from './components/DeviceMatch';
export type { DeviceMatchProps } from './components/DeviceMatch';
export { DEFAULT_DEVICE_BREAKPOINTS_REM } from './utils/deviceSizeCore';
export type {
	DeviceSizeName,
	DeviceMatches,
	DeviceBreakpointsRem,
	UseDeviceSizeOptions,
} from './utils/types';

export {
	defineThemeConfig,
	createTheme,
	applyColorScheme,
	createColorSchemeStore,
	resolveUtilityClasses,
	DEFAULT_THEME_META,
	DEFAULT_SCHEMES,
	startColorSchemeViewTransition,
	updateColorSchemeTogglePosition,
} from '@ohJohny/theme-builder-core';

export type {
	Theme,
	CreatedTheme,
	ThemeConfigInput,
	SchemeName,
	ColorSchemeId,
	ThemeMetaItem,
	ThemeStorageConfig,
	UtilityProps,
	UtilityClassesResult,
	CreateThemeOptions,
} from '@ohJohny/theme-builder-core';
