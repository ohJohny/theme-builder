import { describe, expect, it } from 'vitest';

import { defineThemeConfig } from './defineThemeConfig';

describe('validateThemeConfig semantic scheme coverage', () => {
	it('throws when a semantic color is missing a declared scheme', () => {
		expect(() =>
			defineThemeConfig({
				schemes: ['light', 'dark', 'sepia'] as const,
				colors: {
					semantic: {
						'text-primary': { light: '#111', dark: '#eee' },
					},
				},
			}),
		).toThrow(/missing scheme\(s\): sepia/);
	});
});
