import {
	UTILITY_CLASS_MAP,
	UTILITY_CLASS_MAP_MODE,
	UTILITY_CLASS_NAMES,
	UTILITY_CLASS_OVERRIDES,
} from './generated/utility-class-map';

export type UtilityClassMapMode = 'identity' | 'hashed';

export {
	UTILITY_CLASS_MAP,
	UTILITY_CLASS_MAP_MODE,
	UTILITY_CLASS_NAMES,
	UTILITY_CLASS_OVERRIDES,
};

const utilityClassNameSet = new Set<string>(UTILITY_CLASS_NAMES);

/** Resolves a canonical utility class to the active build map value (identity or hashed). */
export function resolveUtilityClass(canonical: string): string {
	if (canonical in UTILITY_CLASS_MAP) {
		return UTILITY_CLASS_MAP[canonical];
	}
	if (utilityClassNameSet.has(canonical)) {
		return canonical;
	}
	throw new Error(`[resolveUtilityClass] unknown utility class: ${canonical}`);
}
