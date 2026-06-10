import { act, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useTheme } from './ColorSchemeContext';
import { useDeviceSize } from './useDeviceSize';
import { useReducedMotionContext } from './ReducedMotionContext';
import { useReducedMotion } from './useReducedMotion';
import { ThemeProvider, type ThemeProviderProps } from './ThemeProvider';
import { useColorScheme } from './useColorScheme';
import { resetReducedMotionForTests } from '@ohJohny/theme-builder-core';

import { reactTestTheme } from '../testFixtures';

import type { ReactNode } from 'react';

const STORAGE_KEY = 'theme-builder-react-test';

function createWrapper(options: Omit<ThemeProviderProps<typeof reactTestTheme.config>, 'children' | 'theme'> = {}) {
	return function Wrapper({ children }: { children: ReactNode }) {
		return (
			<ThemeProvider
				theme={reactTestTheme}
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

	it('provides the created theme', () => {
		const { result } = renderHook(() => useTheme(), { wrapper: createWrapper() });
		expect(result.current).toBe(reactTestTheme.theme);
	});
});

describe('ThemeProvider / useDeviceSize', () => {
	it('provides device size matches without an extra DeviceSizeProvider', () => {
		Object.defineProperty(window, 'innerWidth', {
			configurable: true,
			writable: true,
			value: 400,
		});

		const { result } = renderHook(() => useDeviceSize(), { wrapper: createWrapper() });
		expect(result.current.mobile).toBe(true);
		expect(result.current.tablet).toBe(false);
	});
});

describe('ThemeProvider / useReducedMotion', () => {
	beforeEach(() => {
		resetReducedMotionForTests();
	});

	afterEach(() => {
		resetReducedMotionForTests();
		vi.restoreAllMocks();
	});

	it('provides reducedMotion from context under ThemeProvider', () => {
		const state = { matches: true };
		const mq = {
			get matches() {
				return state.matches;
			},
			media: '(prefers-reduced-motion: reduce)',
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		} as MediaQueryList;
		vi.spyOn(window, 'matchMedia').mockReturnValue(mq);

		function Readout() {
			return <span data-testid="r">{String(useReducedMotion())}</span>;
		}

		const { unmount } = render(
			<ThemeProvider
				theme={reactTestTheme}
				presetColorScheme="light"
				applyColorSchemeOnMount={false}
			>
				<Readout />
			</ThemeProvider>,
		);

		expect(screen.getByTestId('r').textContent).toBe('true');
		unmount();
	});

	it('exposes reducedMotion via useReducedMotionContext', () => {
		const { result } = renderHook(() => useReducedMotionContext(), {
			wrapper: createWrapper({ reducedMotion: true }),
		});
		expect(result.current.reducedMotion).toBe(true);
	});

	it('reducedMotion prop overrides the OS preference', () => {
		const mq = {
			matches: false,
			media: '(prefers-reduced-motion: reduce)',
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		} as MediaQueryList;
		vi.spyOn(window, 'matchMedia').mockReturnValue(mq);

		const { result } = renderHook(() => useReducedMotion(), {
			wrapper: createWrapper({ reducedMotion: true }),
		});
		expect(result.current).toBe(true);
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
