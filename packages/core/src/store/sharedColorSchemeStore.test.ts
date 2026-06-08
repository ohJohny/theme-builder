import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
	peekOrCreateSharedColorSchemeStore,
	releaseSharedColorSchemeStore,
	resetSharedColorSchemeStoreForTests,
	retainSharedColorSchemeStore,
} from './sharedColorSchemeStore';

describe('sharedColorSchemeStore', () => {
	const schemes = ['light', 'dark'] as const;

	beforeEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
		resetSharedColorSchemeStoreForTests();
	});

	afterEach(() => {
		resetSharedColorSchemeStoreForTests();
		localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
	});

	it('peekOrCreate returns the same instance across calls', () => {
		const first = peekOrCreateSharedColorSchemeStore({
			schemes,
			applyColorSchemeOnMount: false,
		});
		const second = peekOrCreateSharedColorSchemeStore({
			schemes,
			applyColorSchemeOnMount: false,
		});

		expect(first).toBe(second);
	});

	it('retain/release ref-count disposes only when count reaches zero', () => {
		const store = peekOrCreateSharedColorSchemeStore({
			schemes,
			applyColorSchemeOnMount: false,
		});

		retainSharedColorSchemeStore();
		retainSharedColorSchemeStore();

		releaseSharedColorSchemeStore();
		expect(peekOrCreateSharedColorSchemeStore({ schemes, applyColorSchemeOnMount: false })).toBe(
			store,
		);

		releaseSharedColorSchemeStore();
		const recreated = peekOrCreateSharedColorSchemeStore({
			schemes,
			applyColorSchemeOnMount: false,
		});
		expect(recreated).not.toBe(store);
	});

	it('resetSharedColorSchemeStoreForTests clears module state', () => {
		const store = peekOrCreateSharedColorSchemeStore({
			schemes,
			applyColorSchemeOnMount: false,
		});
		retainSharedColorSchemeStore();

		resetSharedColorSchemeStoreForTests();

		const recreated = peekOrCreateSharedColorSchemeStore({
			schemes,
			applyColorSchemeOnMount: false,
		});
		expect(recreated).not.toBe(store);
	});
});
