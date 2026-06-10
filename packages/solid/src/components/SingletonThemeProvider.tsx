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
	peekOrCreateSharedColorSchemeStore,
	releaseSharedColorSchemeStore,
	retainSharedColorSchemeStore,
	type ColorSchemeStoreOptions,
	type CreatedTheme,
	type ThemeConfigInput,
} from '@ohJohny/theme-builder-core';

import { ColorSchemeContext } from './ColorSchemeContext';
import { DeviceSizeProvider } from './DeviceSizeProvider';
import { ReducedMotionProvider } from './ReducedMotionProvider';
import { ThemeContext } from './useTheme';
import type { DeviceBreakpoints } from '../utils/types';

export type SingletonThemeProviderProps<C extends ThemeConfigInput> = Omit<
	ColorSchemeStoreOptions,
	'schemes'
> & {
	readonly theme: CreatedTheme<C>;
	readonly breakpoints?: Partial<DeviceBreakpoints>;
	/** @deprecated Use {@link SingletonThemeProviderProps.breakpoints} */
	readonly breakpointsRem?: Partial<DeviceBreakpoints>;
	/** When set, overrides the OS `prefers-reduced-motion` preference for this subtree. */
	readonly reducedMotion?: boolean;
};

export function SingletonThemeProvider<C extends ThemeConfigInput>(
	props: SingletonThemeProviderProps<C> & { children?: JSX.Element },
) {
	const [local, storeOptions] = splitProps(props, [
		'children',
		'breakpoints',
		'breakpointsRem',
		'reducedMotion',
		'theme',
	]);

	const store = peekOrCreateSharedColorSchemeStore({
		...storeOptions,
		schemes: local.theme.schemes,
		presetColorScheme: storeOptions.presetColorScheme ?? local.theme.defaultScheme,
	});
	const [snapshot, setSnapshot] = createSignal(store.getState());

	onMount(() => {
		retainSharedColorSchemeStore();
		const unsub = store.subscribe(() => setSnapshot(store.getState()));
		onCleanup(() => {
			unsub();
			releaseSharedColorSchemeStore();
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
					<ReducedMotionProvider reducedMotion={local.reducedMotion}>
						{local.children}
					</ReducedMotionProvider>
				</DeviceSizeProvider>
			</ThemeContext.Provider>
		</ColorSchemeContext.Provider>
	);
}
