import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { collectUtilityClassNames } from './utility-class-catalog';
import { hashUtilityClass } from './utility-class-hash';

export type UtilityClassMapMode = 'identity' | 'hashed';

export function buildUtilityClassMap(
	mode: UtilityClassMapMode,
	catalog: readonly string[] = collectUtilityClassNames(),
): Readonly<Record<string, string>> {
	const map: Record<string, string> = {};
	for (const canonical of catalog) {
		map[canonical] = mode === 'identity' ? canonical : hashUtilityClass(canonical);
	}
	return map;
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Rewrites `.canonical` selectors in compiled CSS to hashed names.
 * Replacement order is longest-first to avoid partial overlaps (e.g. `p-md` vs `px-md`).
 */
export function rewriteUtilityCss(
	css: string,
	map: Readonly<Record<string, string>>,
): string {
	const entries = Object.entries(map).filter(([canonical, hashed]) => canonical !== hashed);
	if (entries.length === 0) {
		return css;
	}

	entries.sort(([a], [b]) => b.length - a.length);

	let out = css;
	for (const [canonical, hashed] of entries) {
		const re = new RegExp(
			`\\.${escapeRegExp(canonical)}(?=[\\s,.#\\[:{>+~]|$)`,
			'g',
		);
		out = out.replace(re, `.${hashed}`);
	}
	return out;
}

export function formatUtilityClassMapModule(
	map: Readonly<Record<string, string>>,
	mode: UtilityClassMapMode,
): string {
	const lines = Object.entries(map)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([canonical, hashed]) => `\t${JSON.stringify(canonical)}: ${JSON.stringify(hashed)},`);

	return `/** Auto-generated — do not edit. Mode: ${mode} */\nexport const UTILITY_CLASS_MAP_MODE = ${JSON.stringify(mode)} as const;\n\nexport const UTILITY_CLASS_MAP: Readonly<Record<string, string>> = {\n${lines.join('\n')}\n} as const;\n`;
}

export interface WriteUtilityClassMapOptions {
	readonly mode: UtilityClassMapMode;
	readonly outPath: string;
	readonly catalog?: readonly string[];
}

export async function writeUtilityClassMapFile(
	options: WriteUtilityClassMapOptions,
): Promise<Readonly<Record<string, string>>> {
	const map = buildUtilityClassMap(options.mode, options.catalog);
	await mkdir(path.dirname(options.outPath), { recursive: true });
	await writeFile(
		options.outPath,
		formatUtilityClassMapModule(map, options.mode),
		'utf-8',
	);
	return map;
}

export const DEFAULT_UTILITY_CLASS_MAP_PATH = path.resolve(
	import.meta.dirname,
	'../generated/utility-class-map.ts',
);
