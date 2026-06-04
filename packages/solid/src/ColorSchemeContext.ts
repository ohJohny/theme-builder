import type { Accessor } from 'solid-js';
import { createContext, useContext } from 'solid-js';

import type { ColorSchemeId, ColorSchemeListItem, ThemeMetaItem } from '@ohJohny/theme-builder-core';

export type { ColorSchemeListItem };

export type ColorSchemeContextValue = {
	readonly colorScheme: Accessor<ColorSchemeId>;
	readonly colorSchemeList: Accessor<readonly ColorSchemeListItem[]>;
	readonly labelShort: Accessor<string>;
	readonly changeColorScheme: (next?: ColorSchemeId) => void;
};

const ColorSchemeContext = createContext<ColorSchemeContextValue>();

export function useColorSchemeContext(): ColorSchemeContextValue {
	const context = useContext(ColorSchemeContext);
	if (!context) {
		throw new Error('useColorScheme must be used within a ThemeProvider');
	}
	return context;
}

export { ColorSchemeContext };

export type { ThemeMetaItem };
