import path from 'node:path';

import type { ThemeStorageConfig } from '../colorScheme.types.js';
import { resolveThemeConfigPath } from '../config/resolveThemeConfigPath.js';
import type { UtilityClassMapMode } from '../config/types.js';

export type GenerateCliConfig = {
	readonly cwd: string;
	readonly configPath: string;
	readonly outDir: string;
	readonly mode: UtilityClassMapMode;
	readonly defaultScheme?: string;
	readonly utilityClassHashSalt?: string;
	readonly utilityClassHashPrefix?: string;
	readonly force: boolean;
	readonly initScriptStorage?: ThemeStorageConfig;
	readonly watch: boolean;
	readonly exportDtcg: boolean;
	readonly lintA11y: boolean;
	readonly strictA11y: boolean;
};

function readArg(flag: string): string | undefined {
	const index = process.argv.indexOf(flag);
	if (index === -1) return undefined;
	return process.argv[index + 1];
}

function hasFlag(flag: string): boolean {
	return process.argv.includes(flag);
}

function resolvePath(cwd: string, value: string): string {
	return path.isAbsolute(value) ? value : path.resolve(cwd, value);
}

function parseMode(value: string | undefined): UtilityClassMapMode {
	if (value === 'identity' || value === 'hashed') {
		return value;
	}
	throw new Error(
		`Invalid --mode "${value ?? ''}". Expected "identity" or "hashed".`,
	);
}

function parseStorageType(value: string | undefined): ThemeStorageConfig['type'] | undefined {
	if (value === 'localStorage' || value === 'cookie') {
		return value;
	}
	if (value !== undefined) {
		throw new Error(
			`Invalid --storage-type "${value}". Expected "localStorage" or "cookie".`,
		);
	}
	return undefined;
}

export function resolveGenerateCliConfig(cwd = process.cwd()): GenerateCliConfig {
	const explicitConfigPath = readArg('--config') ?? process.env.THEME_CONFIG;
	const outDir = readArg('--out') ?? process.env.THEME_OUT_DIR ?? 'src/generated';
	const mode = parseMode(readArg('--mode') ?? process.env.THEME_MODE ?? 'hashed');
	const defaultScheme = readArg('--default-scheme') ?? process.env.THEME_DEFAULT_SCHEME;
	const utilityClassHashSalt = readArg('--salt') ?? process.env.THEME_HASH_SALT;
	const utilityClassHashPrefix = readArg('--prefix') ?? process.env.THEME_HASH_PREFIX;
	const storageKey = readArg('--storage-key') ?? process.env.THEME_STORAGE_KEY;
	const storageType = parseStorageType(
		readArg('--storage-type') ?? process.env.THEME_STORAGE_TYPE,
	);
	const initScriptStorage =
		storageKey !== undefined && storageType !== undefined
			? { type: storageType, key: storageKey }
			: undefined;

	return {
		cwd,
		configPath: resolveThemeConfigPath(cwd, explicitConfigPath),
		outDir: resolvePath(cwd, outDir),
		mode,
		defaultScheme,
		utilityClassHashSalt,
		utilityClassHashPrefix,
		force: hasFlag('--force'),
		initScriptStorage,
		watch: hasFlag('--watch'),
		exportDtcg: hasFlag('--export-dtcg'),
		lintA11y: hasFlag('--no-lint-a11y') ? false : true,
		strictA11y: hasFlag('--strict-a11y'),
	};
}
