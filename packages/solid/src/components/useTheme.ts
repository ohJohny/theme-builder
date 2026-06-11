/** @jsxImportSource solid-js */
import { createContext, useContext, type Accessor, type Context } from 'solid-js';

import type { Theme, ThemeConfigInput } from '@ohJohny/theme-builder-core';

export const ThemeConfigContext: Context<Accessor<ThemeConfigInput> | undefined> =
	createContext<Accessor<ThemeConfigInput> | undefined>();

export const ThemeContext: Context<Accessor<Theme<ThemeConfigInput>> | undefined> =
	createContext<Accessor<Theme<ThemeConfigInput>> | undefined>();

export function useTheme<C extends ThemeConfigInput = ThemeConfigInput>(): Theme<C> {
	const themeAccessor = useContext(ThemeContext);
	if (themeAccessor === undefined) {
		throw new ReferenceError('[useTheme] must be used within a ThemeProvider');
	}
	return themeAccessor() as Theme<C>;
}

export type { Theme } from '@ohJohny/theme-builder-core';
