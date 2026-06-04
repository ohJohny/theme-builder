export const LOGICAL_AXIS_PROPERTIES = {
	'padding-inline': ['padding-inline-start', 'padding-inline-end'],
	'padding-block': ['padding-block-start', 'padding-block-end'],
	'margin-inline': ['margin-inline-start', 'margin-inline-end'],
	'margin-block': ['margin-block-start', 'margin-block-end'],
} as const satisfies Record<string, readonly [string, string]>;

export type LogicalAxisProperty = keyof typeof LOGICAL_AXIS_PROPERTIES;

export function isLogicalAxisProperty(prop: string): prop is LogicalAxisProperty {
	return prop in LOGICAL_AXIS_PROPERTIES;
}

function splitCssValueList(value: string): string[] {
	const parts: string[] = [];
	let current = '';
	let depth = 0;

	for (const ch of value) {
		if (ch === '(') {
			depth += 1;
			current += ch;
			continue;
		}
		if (ch === ')') {
			depth = Math.max(0, depth - 1);
			current += ch;
			continue;
		}
		if (/\s/.test(ch) && depth === 0) {
			if (current.trim()) {
				parts.push(current.trim());
			}
			current = '';
			continue;
		}
		current += ch;
	}

	if (current.trim()) {
		parts.push(current.trim());
	}

	return parts;
}

function parseImportant(value: string): { readonly body: string; readonly important: boolean } {
	const match = value.match(/\s*!important\s*$/i);
	if (!match) {
		return { body: value.trim(), important: false };
	}
	return {
		body: value.slice(0, match.index).trim(),
		important: true,
	};
}

function withImportant(token: string, important: boolean): string {
	return important ? `${token} !important` : token;
}

/**
 * Expands a logical axis shorthand into start/end longhands (MDN two-value rules).
 */
export function expandLogicalAxisDeclaration(
	prop: LogicalAxisProperty,
	value: string,
): Record<string, string> {
	const [startProp, endProp] = LOGICAL_AXIS_PROPERTIES[prop];
	const { body, important } = parseImportant(value);
	const parts = splitCssValueList(body);

	if (parts.length === 0) {
		return {};
	}

	const start = parts[0]!;
	const end = parts.length >= 2 ? parts[1]! : start;

	return {
		[startProp]: withImportant(start, important),
		[endProp]: withImportant(end, important),
	};
}

export function expandLogicalAxisDeclarationCss(
	prop: LogicalAxisProperty,
	value: string,
): string {
	return Object.entries(expandLogicalAxisDeclaration(prop, value))
		.map(([name, val]) => `${name}:${val}`)
		.join(';');
}
