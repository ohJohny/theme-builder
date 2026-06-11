import { describe, expect, it } from 'vitest';

import { SYSTEM_COLOR_SCHEME } from './colorScheme.types';
import { resolveAppliedColorScheme } from './resolveAppliedColorScheme';

describe('resolveAppliedColorScheme', () => {
	const schemes = ['light', 'dark', 'sepia'] as const;

	it('returns preference when not system', () => {
		expect(resolveAppliedColorScheme('sepia', schemes, false)).toBe('sepia');
	});

	it('resolves system to dark when prefers dark', () => {
		expect(resolveAppliedColorScheme(SYSTEM_COLOR_SCHEME, schemes, true)).toBe('dark');
	});

	it('resolves system to light when prefers light', () => {
		expect(resolveAppliedColorScheme(SYSTEM_COLOR_SCHEME, schemes, false)).toBe('light');
	});
});
