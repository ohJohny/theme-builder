import { afterEach, describe, expect, it, vi } from 'vitest';

import {
	peekOrCreateSharedColorSchemeStore,
	releaseSharedColorSchemeStore,
	resetSharedColorSchemeStoreForTests,
	retainSharedColorSchemeStore,
} from './sharedColorSchemeStore';

describe('peekOrCreateSharedColorSchemeStore', () => {
	afterEach(() => {
		resetSharedColorSchemeStoreForTests();
		vi.restoreAllMocks();
	});

	it('warns in development when later options mismatch', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.stubEnv('NODE_ENV', 'development');

		peekOrCreateSharedColorSchemeStore({
			schemes: ['light', 'dark'],
			storage: { type: 'localStorage', key: 'a' },
		});
		peekOrCreateSharedColorSchemeStore({
			schemes: ['light', 'dark'],
			storage: { type: 'localStorage', key: 'b' },
		});

		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('SingletonThemeProvider option mismatch'),
		);
	});

	it('retains and releases the shared store by ref count', () => {
		const store = peekOrCreateSharedColorSchemeStore({ schemes: ['light', 'dark'] });
		retainSharedColorSchemeStore();
		releaseSharedColorSchemeStore();
		expect(store.getState().colorScheme).toBe('light');
	});
});
