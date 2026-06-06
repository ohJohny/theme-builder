/** @jsxImportSource solid-js */
import {
	resolveUtilityClasses,
	type CreatedTheme,
	type Theme,
	type ThemeConfigInput,
	type UtilityClassesResult,
	type UtilityProps,
} from '@ohJohny/theme-builder-core';

import { ThemeProvider, type ThemeProviderProps } from './ThemeProvider';
import { useColorScheme } from './useColorScheme';
import { useTheme } from './useTheme';

export function createThemeContext<C extends ThemeConfigInput>(created: CreatedTheme<C>) {
	function BoundThemeProvider(props: Omit<ThemeProviderProps<C>, 'theme'>) {
		return <ThemeProvider {...props} theme={created} />;
	}

	function useThemeFromContext(): Theme<C> {
		return useTheme<C>();
	}

	function useUtilityClassesFromContext(props: UtilityProps<C>): UtilityClassesResult {
		return resolveUtilityClasses(props, created.theme);
	}

	function useColorSchemeFromContext() {
		return useColorScheme();
	}

	return {
		ThemeProvider: BoundThemeProvider,
		useTheme: useThemeFromContext,
		useUtilityClasses: useUtilityClassesFromContext,
		useColorScheme: useColorSchemeFromContext,
		theme: created,
	};
}
