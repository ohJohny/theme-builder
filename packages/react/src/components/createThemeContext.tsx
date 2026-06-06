import {
	useEffect,
	useMemo,
	useSyncExternalStore,
	type ReactNode,
} from 'react';

import {
	createColorSchemeStore,
	resolveUtilityClasses,
	type ColorSchemeStoreOptions,
	type CreatedTheme,
	type ThemeConfigInput,
	type UtilityClassesResult,
	type UtilityProps,
} from '@ohJohny/theme-builder-core';

import {
	ColorSchemeContext,
	type ColorSchemeContextValue,
	ThemeContext,
	useTheme,
} from './ColorSchemeContext';
import { useColorScheme } from './useColorScheme';
import { DeviceSizeProvider } from './DeviceSizeProvider';
import type { DeviceBreakpointsRem } from '../utils/types';

export type ThemeProviderProps<C extends ThemeConfigInput> = Omit<
	ColorSchemeStoreOptions,
	'schemes'
> & {
	readonly theme: CreatedTheme<C>;
	readonly breakpointsRem?: Partial<DeviceBreakpointsRem>;
	readonly children: ReactNode;
};

export function ThemeProvider<C extends ThemeConfigInput>(props: ThemeProviderProps<C>) {
	const { children, breakpointsRem, theme, ...storeOptions } = props;

	const store = useMemo(
		() =>
			createColorSchemeStore({
				...storeOptions,
				schemes: theme.schemes,
				presetColorScheme: storeOptions.presetColorScheme ?? theme.defaultScheme,
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps -- store is created once per theme identity
		[],
	);
	const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);

	useEffect(() => {
		return () => store.dispose();
	}, [store]);

	const colorSchemeValue = useMemo(
		(): ColorSchemeContextValue => ({
			...store,
			state,
		}),
		[store, state],
	);

	return (
		<ColorSchemeContext.Provider value={colorSchemeValue}>
			<ThemeContext.Provider value={theme.theme}>
				<DeviceSizeProvider breakpointsRem={breakpointsRem}>{children}</DeviceSizeProvider>
			</ThemeContext.Provider>
		</ColorSchemeContext.Provider>
	);
}

export function createThemeContext<C extends ThemeConfigInput>(created: CreatedTheme<C>) {
	function BoundThemeProvider(props: Omit<ThemeProviderProps<C>, 'theme'>) {
		return <ThemeProvider {...props} theme={created} />;
	}

	function useThemeFromContext(): CreatedTheme<C>['theme'] {
		return useTheme() as CreatedTheme<C>['theme'];
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
