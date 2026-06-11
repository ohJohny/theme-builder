import { describe, expect, it } from 'vitest';

import { resolveInitialColorScheme } from './resolveInitialColorScheme';

describe('resolveInitialColorScheme', () => {
	const schemes = ['light', 'dark', 'sepia'] as const;

	it('prefers stored value when known', () => {
		expect(
			resolveInitialColorScheme({ schemes, preset: 'light', stored: 'sepia' }),
		).toBe('sepia');
	});

	it('falls back to preset when stored is unknown', () => {
		expect(
			resolveInitialColorScheme({ schemes, preset: 'dark', stored: 'auto' }),
		).toBe('dark');
	});

	it('falls back to first scheme when preset is unknown', () => {
		expect(
			resolveInitialColorScheme({ schemes, preset: 'unknown', stored: null }),
		).toBe('light');
	});
});
