import {
	resolveUtilityClasses,
	type UtilityClassesResult,
	type UtilityProps,
} from '@ohJohny/theme-builder-core';

import { useTheme } from './ColorSchemeContext';

/** Resolves utility props using the current theme from ThemeProvider. */
export function useUtilityClasses(props: UtilityProps): UtilityClassesResult {
	const theme = useTheme();
	return resolveUtilityClasses(props, theme);
}

export type { UtilityClassesResult, UtilityProps } from '@ohJohny/theme-builder-core';
