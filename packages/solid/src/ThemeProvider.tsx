/** @jsxImportSource solid-js */
import {
	createMemo,
	createSignal,
	mergeProps,
	onCleanup,
	onMount,
	splitProps,
	type ParentComponent,
} from 'solid-js';

import {
	createColorSchemeStore,
	ThemeBuilder,
	type ColorSchemeId,
	type ColorSchemeListItem,
	type ColorSchemeStoreOptions,
} from '@ohJohny/theme-builder-core';

import { ColorSchemeContext } from './ColorSchemeContext';
import { getDefaultTheme, ThemeContext } from './useTheme';

export type ThemeProviderProps = ColorSchemeStoreOptions;

export const ThemeProvider: ParentComponent<ThemeProviderProps> = (props) => {
	const merged = mergeProps(
		{
			presetColorScheme: 'light' as const,
			applyColorSchemeOnMount: true,
		},
		props,
	);

	const [local, storeOptions] = splitProps(merged, ['children']);
	const store = createColorSchemeStore(storeOptions);
	const [snapshot, setSnapshot] = createSignal(store.getState());

	onMount(() => {
		const unsub = store.subscribe(() => setSnapshot(store.getState()));
		onCleanup(() => {
			unsub();
			store.dispose();
		});
	});

	const colorScheme = () => snapshot().colorScheme;
	const colorSchemeList = createMemo<readonly ColorSchemeListItem[]>(() => snapshot().colorSchemeList);
	const labelShort = createMemo(() => snapshot().labelShort);

	const colorSchemeValue = {
		colorScheme,
		colorSchemeList,
		labelShort,
		changeColorScheme: store.changeColorScheme,
	};

	const [themeVersion, setThemeVersion] = createSignal(0);
	onMount(() => {
		const unsubTheme = ThemeBuilder.getInstance().subscribe(() =>
			setThemeVersion((v) => v + 1),
		);
		onCleanup(() => unsubTheme());
	});
	const resolvedTheme = createMemo(() => {
		themeVersion();
		return getDefaultTheme();
	});

	return (
		<ColorSchemeContext.Provider value={colorSchemeValue}>
			<ThemeContext.Provider value={resolvedTheme}>{local.children}</ThemeContext.Provider>
		</ColorSchemeContext.Provider>
	);
};
