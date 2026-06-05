import {
	useEffect,
	useMemo,
	useSyncExternalStore,
	type ReactNode,
} from 'react';

import {
	createColorSchemeStore,
	ThemeBuilder,
	type ColorSchemeStoreOptions,
} from '@ohJohny/theme-builder-core';

import {
	ColorSchemeContext,
	type ColorSchemeContextValue,
	ThemeContext,
} from './ColorSchemeContext';
import { DeviceSizeProvider } from './DeviceSizeProvider';
import type { DeviceBreakpointsRem } from '../utils/types';

export type ThemeProviderProps = ColorSchemeStoreOptions & {
	readonly breakpointsRem?: Partial<DeviceBreakpointsRem>;
	readonly children: ReactNode;
};

export function ThemeProvider(props: ThemeProviderProps) {
	const { children, breakpointsRem, ...storeOptions } = props;

	const store = useMemo(() => createColorSchemeStore(storeOptions), []);
	const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);

	useEffect(() => {
		return () => store.dispose();
	}, [store]);

	const themeBuilder = ThemeBuilder.getInstance();
	const theme = useSyncExternalStore(
		(listener) => themeBuilder.subscribe(listener),
		() => themeBuilder.getTheme(),
		() => themeBuilder.getTheme(),
	);

	const colorSchemeValue = useMemo(
		(): ColorSchemeContextValue => ({
			...store,
			state,
		}),
		[store, state],
	);

	return (
		<ColorSchemeContext.Provider value={colorSchemeValue}>
			<ThemeContext.Provider value={theme}>
				<DeviceSizeProvider breakpointsRem={breakpointsRem}>{children}</DeviceSizeProvider>
			</ThemeContext.Provider>
		</ColorSchemeContext.Provider>
	);
}
