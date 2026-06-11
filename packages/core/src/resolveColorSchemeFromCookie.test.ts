import { describe, expect, it } from 'vitest';

import { resolveColorSchemeFromCookie } from './resolveColorSchemeFromCookie';

describe('resolveColorSchemeFromCookie', () => {
	const schemes = ['light', 'dark', 'sepia'] as const;
	const options = { schemes, preset: 'light', storageKey: 'theme' };

	it('reads scheme from cookie header', () => {
		expect(resolveColorSchemeFromCookie('theme=sepia; other=1', options)).toBe('sepia');
	});

	it('returns preset when cookie is missing', () => {
		expect(resolveColorSchemeFromCookie(undefined, options)).toBe('light');
	});

	it('ignores unknown cookie values', () => {
		expect(resolveColorSchemeFromCookie('theme=auto', options)).toBe('light');
	});
});
