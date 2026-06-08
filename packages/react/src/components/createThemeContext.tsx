import {
	type CreatedTheme,
	type Theme,
	type ThemeConfigInput,
	type UtilityClassesResult,
	type UtilityProps,
} from '@ohJohny/theme-builder-core';

import { useTheme } from './ColorSchemeContext';
import { ThemeProvider, type ThemeProviderProps } from './ThemeProvider';
import { useColorScheme } from './useColorScheme';
import { useUtilityClasses } from './useUtilityClasses';

export function createThemeContext<C extends ThemeConfigInput>(created: CreatedTheme<C>) {
	function BoundThemeProvider(props: Omit<ThemeProviderProps<C>, 'theme'>) {
		return <ThemeProvider {...props} theme={created} />;
	}

	function useThemeBound(): Theme<C> {
		return useTheme<C>();
	}

	function useUtilityClassesBound(props: UtilityProps<C>): UtilityClassesResult {
		return useUtilityClasses(props, created);
	}

	return {
		ThemeProvider: BoundThemeProvider,
		useTheme: useThemeBound,
		useUtilityClasses: useUtilityClassesBound,
		useColorScheme,
		theme: created,
	};
}
