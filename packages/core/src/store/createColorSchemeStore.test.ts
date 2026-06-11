import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { applyColorScheme } from '../applyColorScheme';
import { createColorSchemeStore } from './createColorSchemeStore';

describe('createColorSchemeStore', () => {
	const schemes = ['light', 'dark'] as const;
	beforeEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
	});

	afterEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
	});

	it('returns a stable getState reference between consecutive calls', () => {
		const store = createColorSchemeStore({ schemes, applyColorSchemeOnMount: false });
		const first = store.getState();
		const second = store.getState();
		expect(Object.is(first, second)).toBe(true);
	});

	it('changeColorScheme updates snapshot and applies data-theme', () => {
		const store = createColorSchemeStore({
			schemes,
			presetColorScheme: 'light',
			applyColorSchemeOnMount: true,
		});

		expect(store.getState().colorScheme).toBe('light');
		expect(document.documentElement.getAttribute('data-theme')).toBe('light');

		store.changeColorScheme('dark');

		expect(store.getState().colorScheme).toBe('dark');
		expect(store.getState().resolvedColorScheme).toBe('dark');
		expect(store.getState().colorSchemeList.find((item) => item.active)?.id).toBe('dark');
		expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
	});

	it('applies resolved scheme when preference is system', () => {
		const store = createColorSchemeStore({
			schemes,
			presetColorScheme: 'light',
			applyColorSchemeOnMount: true,
		});

		store.changeColorScheme('system');
		expect(store.getState().colorScheme).toBe('system');
		expect(store.getState().resolvedColorScheme).toMatch(/light|dark/);
		expect(document.documentElement.getAttribute('data-theme')).toBe(
			store.getState().resolvedColorScheme,
		);
	});

	it('reads initial scheme from localStorage when configured', () => {
		localStorage.setItem('tb-store-test', 'dark');

		const store = createColorSchemeStore({
			schemes,
			presetColorScheme: 'light',
			storage: { type: 'localStorage', key: 'tb-store-test' },
			applyColorSchemeOnMount: false,
		});

		expect(store.getState().colorScheme).toBe('dark');
	});

	it('reads custom schemes such as sepia from localStorage', () => {
		localStorage.setItem('tb-store-test', 'sepia');

		const store = createColorSchemeStore({
			schemes: ['light', 'dark', 'sepia'],
			presetColorScheme: 'light',
			storage: { type: 'localStorage', key: 'tb-store-test' },
			applyColorSchemeOnMount: false,
		});

		expect(store.getState().colorScheme).toBe('sepia');
	});

	it('dispose clears listeners so subscribers stop receiving updates', () => {
		const store = createColorSchemeStore({ schemes, applyColorSchemeOnMount: false });
		let calls = 0;
		const unsubscribe = store.subscribe(() => {
			calls += 1;
		});

		store.changeColorScheme('dark');
		expect(calls).toBe(1);

		unsubscribe();
		store.dispose();

		applyColorScheme('light');
		store.changeColorScheme('light');
		expect(calls).toBe(1);
	});
});
