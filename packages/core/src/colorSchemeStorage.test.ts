import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
	clearPersistedColorScheme,
	readStoredColorScheme,
	writePersistedColorScheme,
	writeStoredColorScheme,
} from './colorSchemeStorage';

const config = { type: 'localStorage' as const, key: 'test-color-scheme' };

describe('colorSchemeStorage', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		localStorage.clear();
	});

	it('returns null when nothing is stored', () => {
		expect(readStoredColorScheme(config)).toBeNull();
	});

	it('round-trips light via localStorage', () => {
		writeStoredColorScheme(config, 'light');
		expect(readStoredColorScheme(config)).toBe('light');
	});

	it('round-trips dark via localStorage', () => {
		writeStoredColorScheme(config, 'dark');
		expect(readStoredColorScheme(config)).toBe('dark');
	});

	it('ignores invalid stored values', () => {
		localStorage.setItem(config.key, 'auto');
		expect(readStoredColorScheme(config)).toBeNull();
	});

	it('writePersistedColorScheme sets localStorage and cookie', () => {
		writePersistedColorScheme(config.key, 'dark');
		expect(localStorage.getItem(config.key)).toBe('dark');
		expect(document.cookie).toContain(`${config.key}=dark`);
	});

	it('clearPersistedColorScheme removes localStorage and cookie', () => {
		writePersistedColorScheme(config.key, 'light');
		clearPersistedColorScheme(config.key);
		expect(localStorage.getItem(config.key)).toBeNull();
		expect(document.cookie).not.toContain(`${config.key}=`);
	});
});
