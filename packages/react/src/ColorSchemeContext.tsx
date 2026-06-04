import { createContext, useContext } from 'react';

import { createColorSchemeStore, type ColorSchemeId } from '@ohJohny/theme-builder-core';

import type { ColorSchemeStoreState, Theme } from '@ohJohny/theme-builder-core';

export type ColorSchemeContextValue = ReturnType<typeof createColorSchemeStore> & {
	readonly state: ColorSchemeStoreState;
};

export const ColorSchemeContext = createContext<ColorSchemeContextValue | null>(null);

export function useColorSchemeContext(): ColorSchemeContextValue {
	const context = useContext(ColorSchemeContext);
	if (!context) {
		throw new Error('useColorScheme must be used within a ThemeProvider');
	}
	return context;
}

export const ThemeContext = createContext<Theme | null>(null);

export function useTheme(): Theme {
	const theme = useContext(ThemeContext);
	if (!theme) {
		throw new ReferenceError('[useTheme] must be used within a ThemeProvider');
	}
	return theme;
}

export type { ColorSchemeId, ThemeMetaItem, ThemeStorageConfig } from '@ohJohny/theme-builder-core';
