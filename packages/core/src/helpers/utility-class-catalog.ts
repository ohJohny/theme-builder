import {
	BASE_COLOR_TOKEN_NAMES,
	DISPLAY_KEYWORDS,
	FONT_FAMILY_NAMES,
	FONT_SIZE_NAMES,
	FONT_WEIGHT_STEPS,
	ICON_SIZE_NAMES,
	LINE_HEIGHT_STEPS,
	SEMANTIC_COLOR_TOKEN_NAMES,
	SHADOW_SIZE_NAMES,
	SPACING_PREFIXES,
	SPACING_SIZE_NAMES,
} from '../types/theme.js';

/** All canonical global utility class names generated from theme SCSS. */
export function collectUtilityClassNames(): readonly string[] {
	const names = new Set<string>();

	for (const prefix of SPACING_PREFIXES) {
		for (const name of SPACING_SIZE_NAMES) {
			names.add(`${prefix}-${name}`);
		}
	}

	for (const name of SPACING_SIZE_NAMES) {
		names.add(`gap-${name}`);
	}

	for (const token of [...BASE_COLOR_TOKEN_NAMES, ...SEMANTIC_COLOR_TOKEN_NAMES]) {
		names.add(`color-${token}`);
		names.add(`bg-${token}`);
	}

	for (const name of FONT_FAMILY_NAMES) {
		names.add(`font-${name}`);
	}

	for (const name of FONT_SIZE_NAMES) {
		names.add(`text-${name}`);
	}

	for (const step of FONT_WEIGHT_STEPS) {
		names.add(`font-weight-${step}`);
	}

	for (const step of LINE_HEIGHT_STEPS) {
		names.add(`lh-${step}`);
	}

	for (const key of DISPLAY_KEYWORDS) {
		names.add(`d-${key}`);
	}

	for (const name of SHADOW_SIZE_NAMES) {
		names.add(`shadow-${name}`);
	}

	for (const name of ICON_SIZE_NAMES) {
		names.add(`icon-${name}`);
	}

	return [...names].sort();
}
