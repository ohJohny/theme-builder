import { hashUtilityClass } from './utility-class-hash';

export type UtilityClassMapMode = 'identity' | 'hashed';

export function buildUtilityClassMap(
	mode: UtilityClassMapMode,
	catalog: readonly string[],
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

/** Builds a full canonical → resolved map from catalog names and optional overrides. */
export function buildUtilityClassMapFromParts(
	names: readonly string[],
	overrides: Readonly<Record<string, string>> = {},
): Readonly<Record<string, string>> {
	const map: Record<string, string> = {};
	for (const canonical of names) {
		map[canonical] = overrides[canonical] ?? canonical;
	}
	return map;
}

export function formatUtilityClassMapModule(
	map: Readonly<Record<string, string>>,
	mode: UtilityClassMapMode,
	catalog: readonly string[] = Object.keys(map).sort(),
): string {
	const names = [...catalog].sort();
	const overrides = Object.fromEntries(
		Object.entries(map).filter(([canonical, resolved]) => canonical !== resolved),
	);

	const namesBlock = names.map((n) => `\t${JSON.stringify(n)},`).join('\n');

	const overrideLines =
		Object.keys(overrides).length === 0
			? ''
			: Object.entries(overrides)
					.sort(([a], [b]) => a.localeCompare(b))
					.map(([canonical, hashed]) => `\t${JSON.stringify(canonical)}: ${JSON.stringify(hashed)},`)
					.join('\n');

	const overridesBlock =
		overrideLines.length > 0
			? `export const UTILITY_CLASS_OVERRIDES: Readonly<Record<string, string>> = {\n${overrideLines}\n} as const;`
			: 'export const UTILITY_CLASS_OVERRIDES: Readonly<Record<string, string>> = {};';

	const mapBuild = `export const UTILITY_CLASS_MAP: Readonly<Record<string, string>> = Object.fromEntries(
\tUTILITY_CLASS_NAMES.map((name) => [name, UTILITY_CLASS_OVERRIDES[name] ?? name]),
) as Readonly<Record<string, string>>;`;

	return `/** Auto-generated — do not edit. Mode: ${mode} */\nexport const UTILITY_CLASS_MAP_MODE = ${JSON.stringify(mode)} as const;\n\nexport const UTILITY_CLASS_NAMES = [\n${namesBlock}\n] as const;\n\n${overridesBlock}\n\n${mapBuild}\n`;
}
