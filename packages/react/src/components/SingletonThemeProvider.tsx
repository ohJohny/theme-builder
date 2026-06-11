import { useEffect, type ReactNode } from 'react';

import {
	peekOrCreateSharedColorSchemeStore,
	releaseSharedColorSchemeStore,
	retainSharedColorSchemeStore,
	type ColorSchemeStoreOptions,
	type CreatedTheme,
	type ReducedMotionPreference,
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
	/**
	 * `true` / `false` force reduced motion on or off; `'auto'` (default) follows
	 * OS `prefers-reduced-motion`. `false` is not recommended — prefer `'auto'`.
	 */
	readonly reducedMotion?: ReducedMotionPreference;
	readonly children: ReactNode;
};

export function SingletonThemeProvider<C extends ThemeConfigInput>(
	props: SingletonThemeProviderProps<C>,
) {
	const { children, breakpoints, breakpointsRem, reducedMotion, theme, ...storeOptions } = props;

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
			reducedMotion={reducedMotion}
		>
			{children}
		</ThemeProviderTree>
	);
}
