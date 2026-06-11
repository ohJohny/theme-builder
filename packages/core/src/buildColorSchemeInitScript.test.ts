import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { buildColorSchemeInitScript } from './buildColorSchemeInitScript';

describe('buildColorSchemeInitScript', () => {
	beforeEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
	});

	afterEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
	});

	it('generates an IIFE that sets data-theme from localStorage', () => {
		localStorage.setItem('theme', 'sepia');
		const script = buildColorSchemeInitScript({
			schemes: ['light', 'dark', 'sepia'],
			defaultScheme: 'light',
			storage: { type: 'localStorage', key: 'theme' },
		});

		expect(script.startsWith('(function(){')).toBe(true);
		// eslint-disable-next-line no-eval -- intentional: verify blocking init script behavior
		eval(script);
		expect(document.documentElement.getAttribute('data-theme')).toBe('sepia');
	});

	it('falls back to defaultScheme when storage is empty', () => {
		const script = buildColorSchemeInitScript({
			schemes: ['light', 'dark'],
			defaultScheme: 'dark',
			storage: { type: 'localStorage', key: 'theme' },
		});

		// eslint-disable-next-line no-eval -- intentional: verify blocking init script behavior
		eval(script);
		expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
	});

	it('reads from cookie when storage type is cookie', () => {
		document.cookie = 'theme=dark; path=/';
		const script = buildColorSchemeInitScript({
			schemes: ['light', 'dark'],
			defaultScheme: 'light',
			storage: { type: 'cookie', key: 'theme' },
		});

		// eslint-disable-next-line no-eval -- intentional: verify blocking init script behavior
		eval(script);
		expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
	});
});
