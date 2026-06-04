import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ThemeBuilder } from '@ohJohny/theme-builder-core';

import { useTheme } from './ColorSchemeContext';
import { ThemeProvider } from './ThemeProvider';
import { useColorScheme } from './useColorScheme';

import type { ReactNode } from 'react';
import type { ThemeProviderProps } from './ThemeProvider';

const STORAGE_KEY = 'theme-builder-react-test';

function createWrapper(options: Omit<ThemeProviderProps, 'children'> = {}) {
	return function Wrapper({ children }: { children: ReactNode }) {
		return (
			<ThemeProvider
				presetColorScheme="light"
				applyColorSchemeOnMount={false}
				{...options}
			>
				{children}
			</ThemeProvider>
		);
	};
}

describe('ThemeProvider / useTheme', () => {
	it('throws ReferenceError when useTheme is used outside ThemeProvider', () => {
		expect(() => renderHook(() => useTheme())).toThrow(ReferenceError);
		expect(() => renderHook(() => useTheme())).toThrow(/ThemeProvider/);
	});

	it('provides the ThemeBuilder theme', () => {
		const expected = ThemeBuilder.getInstance().getTheme();
		const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });
		expect(result.current).toBe(expected);
	});

	it('re-renders when ThemeBuilder.extend updates the theme', () => {
		const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });
		const before = result.current.spacing.px.md.class;

		act(() => {
			ThemeBuilder.getInstance().extend({
				spacing: {
					px: {
						md: { class: 'tb-test-px-md', value: '99px' },
					},
				},
			});
		});

		expect(result.current.spacing.px.md.class).toBe('tb-test-px-md');
		expect(result.current.spacing.px.md.class).not.toBe(before);
	});
});

describe('ThemeProvider / useColorScheme', () => {
	beforeEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
	});

	afterEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
	});

	it('throws when useColorScheme is used outside ThemeProvider', () => {
		expect(() => renderHook(() => useColorScheme())).toThrow(Error);
		expect(() => renderHook(() => useColorScheme())).toThrow(/ThemeProvider/);
	});

	it('returns preset color scheme and list metadata', () => {
		const { result } = renderHook(() => useColorScheme(), {
			wrapper: createWrapper({ presetColorScheme: 'light' }),
		});

		expect(result.current.colorScheme).toBe('light');
		expect(result.current.colorSchemeList.some((item) => item.id === 'light' && item.active)).toBe(
			true,
		);
		expect(result.current.labelShort.length).toBeGreaterThan(0);
	});

	it('reads stored color scheme from localStorage on mount', () => {
		localStorage.setItem(STORAGE_KEY, 'dark');

		const { result } = renderHook(() => useColorScheme(), {
			wrapper: createWrapper({
				presetColorScheme: 'light',
				storage: { type: 'localStorage', key: STORAGE_KEY },
			}),
		});

		expect(result.current.colorScheme).toBe('dark');
	});

	it('changeColorScheme updates state and applies data-theme when enabled', () => {
		const { result } = renderHook(() => useColorScheme(), {
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
	});
});
