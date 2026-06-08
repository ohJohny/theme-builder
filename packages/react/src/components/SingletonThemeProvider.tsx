import { useEffect, type ReactNode } from 'react';

import {
	peekOrCreateSharedColorSchemeStore,
	releaseSharedColorSchemeStore,
	retainSharedColorSchemeStore,
	type ColorSchemeStoreOptions,
	type CreatedTheme,
	type ThemeConfigInput,
} from '@ohJohny/theme-builder-core';

import { ThemeProviderTree } from './ThemeProviderTree';
import type { DeviceBreakpoints } from '../utils/types';

export type SingletonThemeProviderProps<C extends ThemeConfigInput> = Omit<
	ColorSchemeStoreOptions,
	'schemes'
> & {
	readonly theme: CreatedTheme<C>;
	readonly breakpoints?: Partial<DeviceBreakpoints>;
	/** @deprecated Use {@link SingletonThemeProviderProps.breakpoints} */
	readonly breakpointsRem?: Partial<DeviceBreakpoints>;
	readonly children: ReactNode;
};

export function SingletonThemeProvider<C extends ThemeConfigInput>(
	props: SingletonThemeProviderProps<C>,
) {
	const { children, breakpoints, breakpointsRem, theme, ...storeOptions } = props;

	const store = peekOrCreateSharedColorSchemeStore({
		...storeOptions,
		schemes: theme.schemes,
		presetColorScheme: storeOptions.presetColorScheme ?? theme.defaultScheme,
	});

	useEffect(() => {
		retainSharedColorSchemeStore();
		return () => releaseSharedColorSchemeStore();
	}, []);

	return (
		<ThemeProviderTree
			store={store}
			theme={theme}
			breakpoints={breakpoints}
			breakpointsRem={breakpointsRem}
		>
			{children}
		</ThemeProviderTree>
	);
}
