import { createContext, useContext, type Accessor, type Context } from 'solid-js';

import { ThemeBuilder, type Theme } from '@ohJohny/theme-builder-core';

export function getDefaultTheme(): Theme {
	return ThemeBuilder.getInstance().getTheme();
}

export const ThemeContext: Context<Accessor<Theme> | undefined> =
	createContext<Accessor<Theme> | undefined>();

export function useTheme(): Theme {
	const themeAccessor = useContext(ThemeContext);
	if (themeAccessor === undefined) {
		throw new ReferenceError('[useTheme] must be used within a ThemeProvider');
	}
	return themeAccessor();
}

export type { Theme } from '@ohJohny/theme-builder-core';
