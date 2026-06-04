import {
	DEFAULT_UTILITY_CLASS_MAP_PATH,
	writeUtilityClassMapFile,
	type UtilityClassMapMode,
} from '../src/helpers/utility-class-map.ts';

const mode: UtilityClassMapMode = process.argv.includes('--hashed') ? 'hashed' : 'identity';

await writeUtilityClassMapFile({ mode, outPath: DEFAULT_UTILITY_CLASS_MAP_PATH });
console.log(`Wrote utility class map (${mode}) → ${DEFAULT_UTILITY_CLASS_MAP_PATH}`);
