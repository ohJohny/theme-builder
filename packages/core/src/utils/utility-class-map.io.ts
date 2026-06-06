import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
	buildUtilityClassMap,
	formatUtilityClassMapModule,
	type UtilityClassMapMode,
} from './utility-class-map';

export interface WriteUtilityClassMapOptions {
	readonly mode: UtilityClassMapMode;
	readonly outPath: string;
	readonly catalog?: readonly string[];
	readonly utilityClassHashSalt?: string;
}

export async function writeUtilityClassMapFile(
	options: WriteUtilityClassMapOptions,
): Promise<Readonly<Record<string, string>>> {
	if (options.catalog === undefined) {
		throw new Error('[writeUtilityClassMapFile] catalog is required');
	}
	const catalog = options.catalog;
	const map = buildUtilityClassMap(options.mode, catalog, options.utilityClassHashSalt);
	await mkdir(path.dirname(options.outPath), { recursive: true });
	await writeFile(
		options.outPath,
		formatUtilityClassMapModule(map, options.mode, catalog),
		'utf-8',
	);
	return map;
}
