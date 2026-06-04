import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	startColorSchemeViewTransition,
	updateColorSchemeTogglePosition,
} from './colorSchemeTransition';

describe('updateColorSchemeTogglePosition', () => {
	beforeEach(() => {
		document.documentElement.style.removeProperty('--cs-toggle-pos-x');
		document.documentElement.style.removeProperty('--cs-toggle-pos-y');
	});

	it('sets toggle center CSS variables from element bounds', () => {
		const el = document.createElement('button');
		vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
			x: 100,
			y: 200,
			width: 40,
			height: 40,
			top: 200,
			left: 100,
			right: 140,
			bottom: 240,
			toJSON: () => ({}),
		} as DOMRect);

		updateColorSchemeTogglePosition(el);

		expect(document.documentElement.style.getPropertyValue('--cs-toggle-pos-x')).toBe('120px');
		expect(document.documentElement.style.getPropertyValue('--cs-toggle-pos-y')).toBe('220px');
	});
});

describe('startColorSchemeViewTransition', () => {
	beforeEach(() => {
		document.documentElement.removeAttribute('data-view-transition-name');
	});

	afterEach(() => {
		document.documentElement.removeAttribute('data-view-transition-name');
		vi.restoreAllMocks();
	});

	it('runs updateDom immediately when startViewTransition is unavailable', () => {
		const original = document.startViewTransition;
		// @ts-expect-error test override
		document.startViewTransition = undefined;

		const updateDom = vi.fn();
		startColorSchemeViewTransition(updateDom);

		expect(updateDom).toHaveBeenCalledTimes(1);
		expect(document.documentElement.getAttribute('data-view-transition-name')).toBeNull();

		document.startViewTransition = original;
	});

	it('wraps updateDom in startViewTransition and sets transition name', async () => {
		const updateDom = vi.fn();
		const finished = Promise.resolve();
		const startViewTransition = vi.fn((callback: () => void) => {
			callback();
			return { finished };
		});
		document.startViewTransition =
			startViewTransition as unknown as typeof document.startViewTransition;

		vi.spyOn(window, 'matchMedia').mockReturnValue({
			matches: false,
			media: '(prefers-reduced-motion: reduce)',
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		} as MediaQueryList);

		startColorSchemeViewTransition(updateDom);

		expect(startViewTransition).toHaveBeenCalledTimes(1);
		expect(updateDom).toHaveBeenCalledTimes(1);
		expect(document.documentElement.getAttribute('data-view-transition-name')).toBe(
			'color-scheme-toggle',
		);

		await finished;
		await vi.waitFor(() => {
			expect(document.documentElement.getAttribute('data-view-transition-name')).toBeNull();
		});
	});

	it('skips view transition when prefers-reduced-motion is set', () => {
		const updateDom = vi.fn();
		const startViewTransition = vi.fn();
		document.startViewTransition =
			startViewTransition as unknown as typeof document.startViewTransition;

		vi.spyOn(window, 'matchMedia').mockReturnValue({
			matches: true,
			media: '(prefers-reduced-motion: reduce)',
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		} as MediaQueryList);

		startColorSchemeViewTransition(updateDom);

		expect(startViewTransition).not.toHaveBeenCalled();
		expect(updateDom).toHaveBeenCalledTimes(1);
	});
});
