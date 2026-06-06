import path from 'node:path';

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

export function resolveGenerateCliConfig(cwd = process.cwd()): GenerateCliConfig {
	const configPath =
		readArg('--config') ?? process.env.THEME_CONFIG ?? 'src/theme/default-theme.ts';
	const outDir = readArg('--out') ?? process.env.THEME_OUT_DIR ?? 'src/generated';
	const mode = parseMode(readArg('--mode') ?? process.env.THEME_MODE ?? 'hashed');
	const defaultScheme = readArg('--default-scheme') ?? process.env.THEME_DEFAULT_SCHEME;
	const utilityClassHashSalt = readArg('--salt') ?? process.env.THEME_HASH_SALT;
	const utilityClassHashPrefix = readArg('--prefix') ?? process.env.THEME_HASH_PREFIX;

	return {
		cwd,
		configPath: resolvePath(cwd, configPath),
		outDir: resolvePath(cwd, outDir),
		mode,
		defaultScheme,
		utilityClassHashSalt,
		utilityClassHashPrefix,
		force: hasFlag('--force'),
	};
}
