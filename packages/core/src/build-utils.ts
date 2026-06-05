/**
 * Build-time utility-class helpers for CSS pipelines (not needed in browser runtime).
 */
export {
	buildUtilityClassMap,
	buildUtilityClassMapFromParts,
	rewriteUtilityCss,
	writeUtilityClassMapFile,
	DEFAULT_UTILITY_CLASS_MAP_PATH,
	type UtilityClassMapMode,
} from './utils/utility-class-map.js';
export { collectUtilityClassNames } from './utils/utility-class-catalog.js';
export { UTILITY_CLASS_HASH_SALT } from './utils/utility-class-hash.js';
