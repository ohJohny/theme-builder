import {
	UTILITY_CLASS_MAP,
	UTILITY_CLASS_MAP_MODE,
} from './generated/utility-class-map';

export type UtilityClassMapMode = 'identity' | 'hashed';

export { UTILITY_CLASS_MAP, UTILITY_CLASS_MAP_MODE };

/** Resolves a canonical utility class to the active build map value (identity or hashed). */
export function resolveUtilityClass(canonical: string): string {
	if (!(canonical in UTILITY_CLASS_MAP)) {
		throw new Error(`[resolveUtilityClass] unknown utility class: ${canonical}`);
	}
	return UTILITY_CLASS_MAP[canonical];
}
