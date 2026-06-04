import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useSyncExternalStore,
	type ReactNode,
} from 'react';

import {
	createColorSchemeStore,
	ThemeBuilder,
	type ColorSchemeId,
	type ColorSchemeStoreOptions,
	type Theme,
} from '@ohJohny/theme-builder-core';

import type { ColorSchemeStoreState } from '@ohJohny/theme-builder-core';

export type ColorSchemeContextValue = ReturnType<typeof createColorSchemeStore> & {
	readonly state: ColorSchemeStoreState;
};

const ColorSchemeContext = createContext<ColorSchemeContextValue | null>(null);

export function useColorSchemeContext(): ColorSchemeContextValue {
	const context = useContext(ColorSchemeContext);
	if (!context) {
		throw new Error('useColorScheme must be used within a ThemeProvider');
	}
	return context;
}

const ThemeContext = createContext<Theme | null>(null);

export function useTheme(): Theme {
	const theme = useContext(ThemeContext);
	if (!theme) {
		throw new ReferenceError('[useTheme] must be used within a ThemeProvider');
	}
	return theme;
}

export type ThemeProviderProps = ColorSchemeStoreOptions & {
	readonly children: ReactNode;
};

export function ThemeProvider(props: ThemeProviderProps) {
	const { children, ...storeOptions } = props;

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
			<ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
		</ColorSchemeContext.Provider>
	);
}

export type { ColorSchemeId, ThemeMetaItem, ThemeStorageConfig } from '@ohJohny/theme-builder-core';
