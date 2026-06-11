import type { ReactNode } from 'react';

import type { CreatedTheme, ReducedMotionPreference, ThemeConfigInput } from '@ohJohny/theme-builder-core';

import {
	ColorSchemeContext,
	type ColorSchemeContextValue,
	ThemeConfigContext,
	ThemeContext,
} from './ColorSchemeContext';
import { DeviceSizeProvider } from './DeviceSizeProvider';
import { ReducedMotionProvider } from './ReducedMotionProvider';
import type { DeviceBreakpoints } from '../utils/types';

export type ThemeProviderTreeProps<C extends ThemeConfigInput> = {
	readonly store: ColorSchemeContextValue;
	readonly theme: CreatedTheme<C>;
	readonly breakpoints?: Partial<DeviceBreakpoints>;
	/** @deprecated Use {@link ThemeProviderTreeProps.breakpoints} */
	readonly breakpointsRem?: Partial<DeviceBreakpoints>;
	/**
	 * `true` / `false` force reduced motion on or off; `'auto'` (default) follows
	 * OS `prefers-reduced-motion`. `false` is not recommended — prefer `'auto'`.
	 */
	readonly reducedMotion?: ReducedMotionPreference;
	readonly children: ReactNode;
};

export function ThemeProviderTree<C extends ThemeConfigInput>(props: ThemeProviderTreeProps<C>) {
	const { store, theme, breakpoints, breakpointsRem, reducedMotion, children } = props;

	return (
		<ColorSchemeContext.Provider value={store}>
			<ThemeConfigContext.Provider value={theme.config}>
				<ThemeContext.Provider value={theme.theme}>
					<DeviceSizeProvider breakpoints={breakpoints} breakpointsRem={breakpointsRem}>
					<ReducedMotionProvider reducedMotion={reducedMotion}>{children}</ReducedMotionProvider>
					</DeviceSizeProvider>
				</ThemeContext.Provider>
			</ThemeConfigContext.Provider>
		</ColorSchemeContext.Provider>
	);
}
