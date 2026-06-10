import { useEffect, useRef, type ReactNode } from 'react';

import {
	createColorSchemeStore,
	type ColorSchemeStoreOptions,
	type CreatedTheme,
	type ThemeConfigInput,
} from '@ohJohny/theme-builder-core';

import { ThemeProviderTree } from './ThemeProviderTree';
import type { DeviceBreakpoints } from '../utils/types';

export type ThemeProviderProps<C extends ThemeConfigInput> = Omit<
	ColorSchemeStoreOptions,
	'schemes'
> & {
	readonly theme: CreatedTheme<C>;
	readonly breakpoints?: Partial<DeviceBreakpoints>;
	/** @deprecated Use {@link ThemeProviderProps.breakpoints} */
	readonly breakpointsRem?: Partial<DeviceBreakpoints>;
	/** When set, overrides the OS `prefers-reduced-motion` preference for this subtree. */
	readonly reducedMotion?: boolean;
	readonly children: ReactNode;
};

export function ThemeProvider<C extends ThemeConfigInput>(props: ThemeProviderProps<C>) {
	const { children, breakpoints, breakpointsRem, reducedMotion, theme, ...storeOptions } = props;

	const storeRef = useRef<ReturnType<typeof createColorSchemeStore> | null>(null);
	if (!storeRef.current) {
		storeRef.current = createColorSchemeStore({
			...storeOptions,
			schemes: theme.schemes,
			presetColorScheme: storeOptions.presetColorScheme ?? theme.defaultScheme,
		});
	}
	const store = storeRef.current;

	useEffect(() => {
		return () => store.dispose();
	}, [store]);

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
