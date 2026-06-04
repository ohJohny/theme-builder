import { describe, expect, it } from 'vitest';

import { hashUtilityClass } from './utility-class-hash';

describe('hashUtilityClass', () => {
	it('returns c0-prefixed deterministic hashes', () => {
		expect(hashUtilityClass('px-md')).toBe(hashUtilityClass('px-md'));
		expect(hashUtilityClass('px-md')).toMatch(/^c0-[a-f0-9]{6}$/);
	});

	it('produces different hashes for different canonical names', () => {
		expect(hashUtilityClass('px-md')).not.toBe(hashUtilityClass('py-md'));
	});
});
