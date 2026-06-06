/** @jsxImportSource solid-js */
import {
	createMemo,
	createSignal,
	onCleanup,
	onMount,
	splitProps,
	type JSX,
} from 'solid-js';

import {
	createColorSchemeStore,
	type ColorSchemeStoreOptions,
	type CreatedTheme,
	type ThemeConfigInput,
} from '@ohJohny/theme-builder-core';

import { ColorSchemeContext } from './ColorSchemeContext';
import { DeviceSizeProvider } from './DeviceSizeProvider';
import { ThemeContext } from './useTheme';
import type { DeviceBreakpoints } from '../utils/types';

export type ThemeProviderProps<C extends ThemeConfigInput> = Omit<
	ColorSchemeStoreOptions,
	'schemes'
> & {
	readonly theme: CreatedTheme<C>;
	readonly breakpoints?: Partial<DeviceBreakpoints>;
	/** @deprecated Use {@link ThemeProviderProps.breakpoints} */
	readonly breakpointsRem?: Partial<DeviceBreakpoints>;
};

export function ThemeProvider<C extends ThemeConfigInput>(
	props: ThemeProviderProps<C> & { children?: JSX.Element },
) {
	const [local, storeOptions] = splitProps(props, [
		'children',
		'breakpoints',
		'breakpointsRem',
		'theme',
	]);

	const store = createColorSchemeStore({
		...storeOptions,
		schemes: local.theme.schemes,
		presetColorScheme: storeOptions.presetColorScheme ?? local.theme.defaultScheme,
	});
	const [snapshot, setSnapshot] = createSignal(store.getState());

	onMount(() => {
		const unsub = store.subscribe(() => setSnapshot(store.getState()));
		onCleanup(() => {
			unsub();
			store.dispose();
		});
	});

	const colorScheme = () => snapshot().colorScheme;
	const colorSchemeList = createMemo(() => snapshot().colorSchemeList);
	const labelShort = createMemo(() => snapshot().labelShort);

	const colorSchemeValue = {
		colorScheme,
		colorSchemeList,
		labelShort,
		changeColorScheme: store.changeColorScheme,
	};

	const themeAccessor = () => local.theme.theme;

	return (
		<ColorSchemeContext.Provider value={colorSchemeValue}>
			<ThemeContext.Provider value={themeAccessor}>
				<DeviceSizeProvider breakpoints={local.breakpoints} breakpointsRem={local.breakpointsRem}>
					{local.children}
				</DeviceSizeProvider>
			</ThemeContext.Provider>
		</ColorSchemeContext.Provider>
	);
}
