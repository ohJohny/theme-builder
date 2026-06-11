import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
	clearPersistedColorScheme,
	readStoredColorScheme,
	writePersistedColorScheme,
	writeStoredColorScheme,
} from './colorSchemeStorage';

const config = { type: 'localStorage' as const, key: 'test-color-scheme' };
const schemes = ['light', 'dark', 'sepia'] as const;

describe('colorSchemeStorage', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		localStorage.clear();
	});

	it('returns null when nothing is stored', () => {
		expect(readStoredColorScheme(config, schemes)).toBeNull();
	});

	it('round-trips light via localStorage', () => {
		writeStoredColorScheme(config, 'light');
		expect(readStoredColorScheme(config, schemes)).toBe('light');
	});

	it('round-trips dark via localStorage', () => {
		writeStoredColorScheme(config, 'dark');
		expect(readStoredColorScheme(config, schemes)).toBe('dark');
	});

	it('round-trips custom schemes such as sepia', () => {
		writeStoredColorScheme(config, 'sepia');
		expect(readStoredColorScheme(config, schemes)).toBe('sepia');
	});

	it('round-trips system preference when enabled', () => {
		writeStoredColorScheme(config, 'system');
		expect(readStoredColorScheme(config, schemes)).toBe('system');
	});

	it('ignores system preference when includeSystemScheme is false', () => {
		writeStoredColorScheme(config, 'system');
		expect(readStoredColorScheme(config, schemes, false)).toBeNull();
	});

	it('ignores invalid stored values', () => {
		localStorage.setItem(config.key, 'auto');
		expect(readStoredColorScheme(config, schemes)).toBeNull();
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
