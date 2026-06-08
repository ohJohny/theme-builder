import { act, render, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { resetSharedColorSchemeStoreForTests } from '@ohJohny/theme-builder-core';

import { useColorSchemeContext, useTheme } from './ColorSchemeContext';
import { useDeviceSize } from './useDeviceSize';
import {
	SingletonThemeProvider,
	type SingletonThemeProviderProps,
} from './SingletonThemeProvider';
import { useColorScheme } from './useColorScheme';
import { reactTestTheme } from '../testFixtures';

import type { ReactNode } from 'react';

const STORAGE_KEY = 'theme-builder-react-singleton-test';

function createWrapper(
	options: Omit<SingletonThemeProviderProps<typeof reactTestTheme.config>, 'children' | 'theme'> = {},
) {
	return function Wrapper({ children }: { children: ReactNode }) {
		return (
			<SingletonThemeProvider
				theme={reactTestTheme}
				presetColorScheme="light"
				applyColorSchemeOnMount={false}
				{...options}
			>
				{children}
			</SingletonThemeProvider>
		);
	};
}

describe('SingletonThemeProvider / useTheme', () => {
	afterEach(() => {
		resetSharedColorSchemeStoreForTests();
	});

	it('throws ReferenceError when useTheme is used outside SingletonThemeProvider', () => {
		expect(() => renderHook(() => useTheme())).toThrow(ReferenceError);
		expect(() => renderHook(() => useTheme())).toThrow(/ThemeProvider/);
	});

	it('provides the created theme', () => {
		const { result, unmount } = renderHook(() => useTheme(), { wrapper: createWrapper() });
		expect(result.current).toBe(reactTestTheme.theme);
		unmount();
	});
});

describe('SingletonThemeProvider / useDeviceSize', () => {
	afterEach(() => {
		resetSharedColorSchemeStoreForTests();
	});

	it('provides device size matches without an extra DeviceSizeProvider', () => {
		Object.defineProperty(window, 'innerWidth', {
			configurable: true,
			writable: true,
			value: 400,
		});

		const { result, unmount } = renderHook(() => useDeviceSize(), { wrapper: createWrapper() });
		expect(result.current.mobile).toBe(true);
		expect(result.current.tablet).toBe(false);
		unmount();
	});
});

describe('SingletonThemeProvider / useColorScheme', () => {
	beforeEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
		resetSharedColorSchemeStoreForTests();
	});

	afterEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
		resetSharedColorSchemeStoreForTests();
	});

	it('throws when useColorScheme is used outside SingletonThemeProvider', () => {
		expect(() => renderHook(() => useColorScheme())).toThrow(Error);
		expect(() => renderHook(() => useColorScheme())).toThrow(/ThemeProvider/);
	});

	it('returns preset color scheme and list metadata', () => {
		const { result, unmount } = renderHook(() => useColorScheme(), {
			wrapper: createWrapper({ presetColorScheme: 'light' }),
		});

		expect(result.current.colorScheme).toBe('light');
		expect(result.current.colorSchemeList.some((item) => item.id === 'light' && item.active)).toBe(
			true,
		);
		expect(result.current.labelShort.length).toBeGreaterThan(0);
		unmount();
	});

	it('reads stored color scheme from localStorage on mount', () => {
		localStorage.setItem(STORAGE_KEY, 'dark');

		const { result, unmount } = renderHook(() => useColorScheme(), {
			wrapper: createWrapper({
				presetColorScheme: 'light',
				storage: { type: 'localStorage', key: STORAGE_KEY },
			}),
		});

		expect(result.current.colorScheme).toBe('dark');
		unmount();
	});

	it('changeColorScheme updates state and applies data-theme when enabled', () => {
		const { result, unmount } = renderHook(() => useColorScheme(), {
			wrapper: createWrapper({
				presetColorScheme: 'light',
				applyColorSchemeOnMount: true,
			}),
		});

		expect(document.documentElement.getAttribute('data-theme')).toBe('light');

		act(() => {
			result.current.changeColorScheme('dark');
		});

		expect(result.current.colorScheme).toBe('dark');
		expect(result.current.colorSchemeList.find((item) => item.active)?.id).toBe('dark');
		expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
		unmount();
	});
});

describe('SingletonThemeProvider / shared store', () => {
	beforeEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
		resetSharedColorSchemeStoreForTests();
	});

	afterEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
		resetSharedColorSchemeStoreForTests();
	});

	it('shares the same store across separate roots', () => {
		const { result: first, unmount: unmountFirst } = renderHook(() => useColorSchemeContext(), {
			wrapper: createWrapper({ applyColorSchemeOnMount: false }),
		});
		const { result: second, unmount: unmountSecond } = renderHook(() => useColorSchemeContext(), {
			wrapper: createWrapper({ applyColorSchemeOnMount: false }),
		});

		expect(first.current.changeColorScheme).toBe(second.current.changeColorScheme);
		expect(first.current.subscribe).toBe(second.current.subscribe);

		unmountFirst();
		unmountSecond();
	});

	it('syncs color scheme changes across separate roots', () => {
		const { result: first, unmount: unmountFirst } = renderHook(() => useColorScheme(), {
			wrapper: createWrapper({
				presetColorScheme: 'light',
				applyColorSchemeOnMount: false,
			}),
		});
		const { result: second, unmount: unmountSecond } = renderHook(() => useColorScheme(), {
			wrapper: createWrapper({
				presetColorScheme: 'light',
				applyColorSchemeOnMount: false,
			}),
		});

		expect(first.current.colorScheme).toBe('light');
		expect(second.current.colorScheme).toBe('light');

		act(() => {
			first.current.changeColorScheme('dark');
		});

		expect(first.current.colorScheme).toBe('dark');
		expect(second.current.colorScheme).toBe('dark');

		unmountFirst();
		unmountSecond();
	});

	it('recreates the store after all providers unmount', () => {
		localStorage.setItem(STORAGE_KEY, 'dark');

		const { result: first, unmount: unmountFirst } = renderHook(() => useColorScheme(), {
			wrapper: createWrapper({
				presetColorScheme: 'light',
				storage: { type: 'localStorage', key: STORAGE_KEY },
				applyColorSchemeOnMount: false,
			}),
		});

		expect(first.current.colorScheme).toBe('dark');
		unmountFirst();

		localStorage.setItem(STORAGE_KEY, 'light');

		const { result: second, unmount: unmountSecond } = renderHook(() => useColorScheme(), {
			wrapper: createWrapper({
				presetColorScheme: 'light',
				storage: { type: 'localStorage', key: STORAGE_KEY },
				applyColorSchemeOnMount: false,
			}),
		});

		expect(second.current.colorScheme).toBe('light');
		unmountSecond();
	});

	it('syncs color scheme across separate render trees', () => {
		function IslandA() {
			const { colorScheme, changeColorScheme } = useColorScheme();
			return (
				<button type="button" onClick={() => changeColorScheme('dark')}>
					{colorScheme}
				</button>
			);
		}

		function IslandB() {
			const { colorScheme } = useColorScheme();
			return <output>{colorScheme}</output>;
		}

		const viewA = render(
			<SingletonThemeProvider
				theme={reactTestTheme}
				presetColorScheme="light"
				applyColorSchemeOnMount={false}
			>
				<IslandA />
			</SingletonThemeProvider>,
		);
		const viewB = render(
			<SingletonThemeProvider
				theme={reactTestTheme}
				presetColorScheme="light"
				applyColorSchemeOnMount={false}
			>
				<IslandB />
			</SingletonThemeProvider>,
		);

		expect(viewA.getByRole('button').textContent).toBe('light');
		expect(viewB.container.querySelector('output')?.textContent).toBe('light');

		act(() => {
			viewA.getByRole('button').click();
		});

		expect(viewA.getByRole('button').textContent).toBe('dark');
		expect(viewB.container.querySelector('output')?.textContent).toBe('dark');

		viewA.unmount();
		viewB.unmount();
	});
});
