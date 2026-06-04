import { createHash } from 'node:crypto';

/** Stable salt — bump when intentionally invalidating published hashed class names. */
export const UTILITY_CLASS_HASH_SALT = 'component-0-utility-v1';

/** Deterministic short hash for a canonical utility class → `c0-<hex>`. */
export function hashUtilityClass(canonical: string): string {
	const digest = createHash('sha256')
		.update(`${UTILITY_CLASS_HASH_SALT}\0${canonical}`)
		.digest('hex');
	return `c0-${digest.slice(0, 6)}`;
}
