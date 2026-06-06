import { describe, expect, it } from 'vitest';

import { hashUtilityClass, UTILITY_CLASS_HASH_SALT } from './utility-class-hash';

describe('hashUtilityClass', () => {
	it('returns c0-prefixed deterministic hashes', () => {
		expect(hashUtilityClass('px-md')).toBe(hashUtilityClass('px-md'));
		expect(hashUtilityClass('px-md')).toMatch(/^c0-[a-f0-9]{6}$/);
	});

	it('produces different hashes for different canonical names', () => {
		expect(hashUtilityClass('px-md')).not.toBe(hashUtilityClass('py-md'));
	});

	it('uses UTILITY_CLASS_HASH_SALT by default', () => {
		expect(hashUtilityClass('px-md')).toBe(hashUtilityClass('px-md', UTILITY_CLASS_HASH_SALT));
	});

	it('accepts a custom salt', () => {
		const custom = hashUtilityClass('px-md', 'my-lib');
		expect(custom).toMatch(/^c0-[a-f0-9]{6}$/);
		expect(custom).not.toBe(hashUtilityClass('px-md'));
	});
});
