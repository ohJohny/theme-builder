import { describe, expect, it } from 'vitest';

import {
	hashUtilityClass,
	UTILITY_CLASS_HASH_PREFIX,
	UTILITY_CLASS_HASH_SALT,
} from './utility-class-hash';

describe('hashUtilityClass', () => {
	it('returns cl-prefixed deterministic hashes', () => {
		expect(hashUtilityClass('px-md')).toBe(hashUtilityClass('px-md'));
		expect(hashUtilityClass('px-md')).toMatch(/^cl-[a-f0-9]{6}$/);
	});

	it('produces different hashes for different canonical names', () => {
		expect(hashUtilityClass('px-md')).not.toBe(hashUtilityClass('py-md'));
	});

	it('uses UTILITY_CLASS_HASH_SALT by default', () => {
		expect(hashUtilityClass('px-md')).toBe(hashUtilityClass('px-md', UTILITY_CLASS_HASH_SALT));
	});

	it('uses UTILITY_CLASS_HASH_PREFIX by default', () => {
		expect(hashUtilityClass('px-md')).toBe(
			hashUtilityClass('px-md', UTILITY_CLASS_HASH_SALT, UTILITY_CLASS_HASH_PREFIX),
		);
	});

	it('accepts a custom salt', () => {
		const custom = hashUtilityClass('px-md', 'my-lib');
		expect(custom).toMatch(/^cl-[a-f0-9]{6}$/);
		expect(custom).not.toBe(hashUtilityClass('px-md'));
	});

	it('accepts a custom prefix', () => {
		const custom = hashUtilityClass('px-md', UTILITY_CLASS_HASH_SALT, 'tb');
		expect(custom).toMatch(/^tb-[a-f0-9]{6}$/);
		expect(custom).not.toBe(hashUtilityClass('px-md'));
	});
});
