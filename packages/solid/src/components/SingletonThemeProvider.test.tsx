/** @jsxImportSource solid-js */
import { render, screen } from '@solidjs/testing-library';
import type { JSX } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	resetReducedMotionForTests,
	resetSharedColorSchemeStoreForTests,
} from '@ohJohny/theme-builder-core';

import { useColorSchemeContext } from './ColorSchemeContext';
import {
	SingletonThemeProvider,
	type SingletonThemeProviderProps,
} from './SingletonThemeProvider';
import { useColorScheme } from './useColorScheme';
import { useDeviceSize } from './useDeviceSize';
import { useReducedMotion } from './useReducedMotion';
import { useReducedMotionContext } from './ReducedMotionContext';
import { useTheme } from './useTheme';
import { solidTestTheme } from '../testFixtures';

const STORAGE_KEY = 'theme-builder-solid-singleton-test';

type ProviderOptions = Omit<
	SingletonThemeProviderProps<typeof solidTestTheme.config>,
	'children' | 'theme'
>;

function renderWithProvider(
	ui: () => JSX.Element,
	options: ProviderOptions = {},
) {
	return render(() => (
		<SingletonThemeProvider
			theme={solidTestTheme}
			presetColorScheme="light"
			applyColorSchemeOnMount={false}
			{...options}
		>
			{ui()}
		</SingletonThemeProvider>
	));
}

describe('SingletonThemeProvider / useTheme', () => {
	afterEach(() => {
		resetSharedColorSchemeStoreForTests();
	});

	it('provides the created theme', () => {
		let themeValue: ReturnType<typeof useTheme> | undefined;

		const { unmount } = renderWithProvider(() => {
			themeValue = useTheme();
			return null;
		});

		expect(themeValue).toBe(solidTestTheme.theme);
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

		const { unmount } = renderWithProvider(() => {
			const matches = useDeviceSize();
			return <span data-testid="mobile">{String(matches().mobile)}</span>;
		});

		expect(screen.getByTestId('mobile').textContent).toBe('true');
		unmount();
	});
});

describe('SingletonThemeProvider / useReducedMotion', () => {
	afterEach(() => {
		resetReducedMotionForTests();
		resetSharedColorSchemeStoreForTests();
	});

	it('provides reducedMotion from context under ThemeProvider', () => {
		const mq = {
			matches: true,
			media: '(prefers-reduced-motion: reduce)',
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		} as MediaQueryList;
		vi.spyOn(window, 'matchMedia').mockReturnValue(mq);

		const { unmount } = renderWithProvider(() => {
			const reduced = useReducedMotion();
			return <span data-testid="r">{String(reduced())}</span>;
		});

		expect(screen.getByTestId('r').textContent).toBe('true');
		unmount();
	});

	it('exposes reducedMotion via useReducedMotionContext', () => {
		let reducedMotion: boolean | undefined;

		const { unmount } = renderWithProvider(
			() => {
				reducedMotion = useReducedMotionContext().reducedMotion();
				return null;
			},
			{ reducedMotion: true },
		);

		expect(reducedMotion).toBe(true);
		unmount();
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

		const { unmount } = renderWithProvider(
			() => {
				const reduced = useReducedMotion();
				return <span data-testid="r">{String(reduced())}</span>;
			},
			{ reducedMotion: true },
		);

		expect(screen.getByTestId('r').textContent).toBe('true');
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

	it('returns preset color scheme and list metadata', () => {
		const { unmount } = renderWithProvider(
			() => {
				const scheme = useColorScheme();
				return (
					<>
						<span data-testid="scheme">{scheme.colorScheme()}</span>
						<span data-testid="label">{scheme.labelShort()}</span>
					</>
				);
			},
			{ presetColorScheme: 'light' },
		);

		expect(screen.getByTestId('scheme').textContent).toBe('light');
		expect(screen.getByTestId('label').textContent?.length).toBeGreaterThan(0);
		unmount();
	});

	it('reads stored color scheme from localStorage on mount', () => {
		localStorage.setItem(STORAGE_KEY, 'dark');

		const { unmount } = renderWithProvider(
			() => {
				const scheme = useColorScheme();
				return <span data-testid="scheme">{scheme.colorScheme()}</span>;
			},
			{
				presetColorScheme: 'light',
				storage: { type: 'localStorage', key: STORAGE_KEY },
			},
		);

		expect(screen.getByTestId('scheme').textContent).toBe('dark');
		unmount();
	});

	it('changeColorScheme updates state and applies data-theme when enabled', () => {
		const { unmount } = renderWithProvider(
			() => {
				const scheme = useColorScheme();
				return (
					<button type="button" onClick={() => scheme.changeColorScheme('dark')}>
						{scheme.colorScheme()}
					</button>
				);
			},
			{
				presetColorScheme: 'light',
				applyColorSchemeOnMount: true,
			},
		);

		expect(document.documentElement.getAttribute('data-theme')).toBe('light');
		screen.getByRole('button').click();
		expect(screen.getByRole('button').textContent).toBe('dark');
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
		let firstContext: ReturnType<typeof useColorSchemeContext> | undefined;
		let secondContext: ReturnType<typeof useColorSchemeContext> | undefined;

		const viewA = renderWithProvider(() => {
			firstContext = useColorSchemeContext();
			return null;
		});
		const viewB = renderWithProvider(() => {
			secondContext = useColorSchemeContext();
			return null;
		});

		expect(firstContext?.changeColorScheme).toBe(secondContext?.changeColorScheme);

		viewA.unmount();
		viewB.unmount();
	});

	it('syncs color scheme changes across separate roots', () => {
		let changeColorScheme: ReturnType<typeof useColorScheme>['changeColorScheme'] | undefined;

		const viewA = renderWithProvider(() => {
			const scheme = useColorScheme();
			changeColorScheme = scheme.changeColorScheme;
			return <span data-testid="a">{scheme.colorScheme()}</span>;
		});
		const viewB = renderWithProvider(() => {
			const scheme = useColorScheme();
			return <span data-testid="b">{scheme.colorScheme()}</span>;
		});

		expect(screen.getByTestId('a').textContent).toBe('light');
		expect(screen.getByTestId('b').textContent).toBe('light');

		changeColorScheme?.('dark');

		expect(screen.getByTestId('a').textContent).toBe('dark');
		expect(screen.getByTestId('b').textContent).toBe('dark');

		viewA.unmount();
		viewB.unmount();
	});

	it('recreates the store after all providers unmount', () => {
		localStorage.setItem(STORAGE_KEY, 'dark');

		const first = renderWithProvider(
			() => {
				const scheme = useColorScheme();
				return <span data-testid="scheme">{scheme.colorScheme()}</span>;
			},
			{
				presetColorScheme: 'light',
				storage: { type: 'localStorage', key: STORAGE_KEY },
			},
		);

		expect(screen.getByTestId('scheme').textContent).toBe('dark');
		first.unmount();

		localStorage.setItem(STORAGE_KEY, 'light');

		const second = renderWithProvider(
			() => {
				const scheme = useColorScheme();
				return <span data-testid="scheme">{scheme.colorScheme()}</span>;
			},
			{
				presetColorScheme: 'light',
				storage: { type: 'localStorage', key: STORAGE_KEY },
			},
		);

		expect(screen.getByTestId('scheme').textContent).toBe('light');
		second.unmount();
	});
});
