import {
	resolveUtilityClasses,
	type CreatedTheme,
	type ThemeConfigInput,
	type UtilityClassesResult,
	type UtilityProps,
} from '@ohJohny/theme-builder-core';

import { useTheme } from './ColorSchemeContext';
import { useDeviceSize } from './useDeviceSize';

/** Resolves utility props using the current theme from ThemeProvider. */
export function useUtilityClasses<C extends ThemeConfigInput>(
	props: UtilityProps<C>,
	created?: CreatedTheme<C>,
): UtilityClassesResult {
	const theme = created?.theme ?? useTheme<C>();
	const deviceMatches = useDeviceSize();
	return resolveUtilityClasses(props, theme, { deviceMatches });
}

export type { UtilityClassesResult, UtilityProps } from '@ohJohny/theme-builder-core';
