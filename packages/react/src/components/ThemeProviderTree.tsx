import type { ReactNode } from 'react';

import type { CreatedTheme, ThemeConfigInput } from '@ohJohny/theme-builder-core';

import { ColorSchemeContext, type ColorSchemeContextValue, ThemeContext } from './ColorSchemeContext';
import { DeviceSizeProvider } from './DeviceSizeProvider';
import type { DeviceBreakpoints } from '../utils/types';

export type ThemeProviderTreeProps<C extends ThemeConfigInput> = {
	readonly store: ColorSchemeContextValue;
	readonly theme: CreatedTheme<C>;
	readonly breakpoints?: Partial<DeviceBreakpoints>;
	/** @deprecated Use {@link ThemeProviderTreeProps.breakpoints} */
	readonly breakpointsRem?: Partial<DeviceBreakpoints>;
	readonly children: ReactNode;
};

export function ThemeProviderTree<C extends ThemeConfigInput>(props: ThemeProviderTreeProps<C>) {
	const { store, theme, breakpoints, breakpointsRem, children } = props;

	return (
		<ColorSchemeContext.Provider value={store}>
			<ThemeContext.Provider value={theme.theme}>
				<DeviceSizeProvider breakpoints={breakpoints} breakpointsRem={breakpointsRem}>
					{children}
				</DeviceSizeProvider>
			</ThemeContext.Provider>
		</ColorSchemeContext.Provider>
	);
}
