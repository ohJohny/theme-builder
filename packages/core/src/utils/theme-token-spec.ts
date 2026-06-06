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
	type DisplayKeyword,
	type SpacingPrefix,
} from '../types/theme.js';

export function colorVarName(name: string): string {
	return `--color-${name}`;
}

export function colorVarRef(name: string): string {
	return `var(${colorVarName(name)})`;
}

export function colorForegroundClass(name: string): string {
	return `color-${name}`;
}

export function colorBackgroundClass(name: string): string {
	return `bg-${name}`;
}

export function colorUtilityClasses(name: string): {
	readonly foreground: string;
	readonly background: string;
} {
	return {
		foreground: colorForegroundClass(name),
		background: colorBackgroundClass(name),
	};
}

export function spaceVarName(name: string): string {
	return `--space-${name}`;
}

export function spaceVarRef(name: string): string {
	return `var(${spaceVarName(name)})`;
}

export function spacingUtilityClass(prefix: SpacingPrefix, name: string): string {
	return `${prefix}-${name}`;
}

export function gapUtilityClass(name: string): string {
	return `gap-${name}`;
}

export function fontFamilyVarName(name: string): string {
	return `--font-family-${name}`;
}

export function fontFamilyVarRef(name: string): string {
	return `var(${fontFamilyVarName(name)})`;
}

export function fontFamilyUtilityClass(name: string): string {
	return `font-${name}`;
}

export function fontSizeVarName(name: string): string {
	return `--font-size-${name}`;
}

export function fontSizeVarRef(name: string): string {
	return `var(${fontSizeVarName(name)})`;
}

export function fontSizeUtilityClass(name: string): string {
	return `text-${name}`;
}

export function fontWeightVarName(step: string | number): string {
	return `--font-weight-${step}`;
}

export function fontWeightVarRef(step: string | number): string {
	return `var(${fontWeightVarName(step)})`;
}

export function fontWeightUtilityClass(step: string | number): string {
	return `font-weight-${step}`;
}

export function lineHeightVarName(step: string | number): string {
	return `--lh-${step}`;
}

export function lineHeightVarRef(step: string | number): string {
	return `var(${lineHeightVarName(step)})`;
}

export function lineHeightUtilityClass(step: string | number): string {
	return `lh-${step}`;
}

export function shadowVarName(name: string): string {
	return `--shadow-${name}`;
}

export function shadowVarRef(name: string): string {
	return `var(${shadowVarName(name)})`;
}

export function shadowUtilityClass(name: string): string {
	return `shadow-${name}`;
}

export function iconVarName(name: string): string {
	return `--icon-size-${name}`;
}

export function iconVarRef(name: string): string {
	return `var(${iconVarName(name)})`;
}

export function iconUtilityClass(name: string): string {
	return `icon-${name}`;
}

export function displayUtilityClass(name: string): string {
	return `d-${name}`;
}

export function iterateSpacingUtilities(
	cb: (prefix: SpacingPrefix, name: string, canonicalClass: string) => void,
): void {
	for (const prefix of SPACING_PREFIXES) {
		for (const name of SPACING_SIZE_NAMES) {
			cb(prefix, name, spacingUtilityClass(prefix, name));
		}
	}
}

export function iterateGapUtilities(cb: (name: string, canonicalClass: string) => void): void {
	for (const name of SPACING_SIZE_NAMES) {
		cb(name, gapUtilityClass(name));
	}
}

export function iterateColorUtilities(
	cb: (token: string, foregroundClass: string, backgroundClass: string) => void,
): void {
	for (const token of [...BASE_COLOR_TOKEN_NAMES, ...SEMANTIC_COLOR_TOKEN_NAMES]) {
		const { foreground, background } = colorUtilityClasses(token);
		cb(token, foreground, background);
	}
}

export function iterateFontFamilyUtilities(cb: (name: string, canonicalClass: string) => void): void {
	for (const name of FONT_FAMILY_NAMES) {
		cb(name, fontFamilyUtilityClass(name));
	}
}

export function iterateFontSizeUtilities(cb: (name: string, canonicalClass: string) => void): void {
	for (const name of FONT_SIZE_NAMES) {
		cb(name, fontSizeUtilityClass(name));
	}
}

export function iterateFontWeightUtilities(
	cb: (step: number, canonicalClass: string) => void,
): void {
	for (const step of FONT_WEIGHT_STEPS) {
		cb(step, fontWeightUtilityClass(step));
	}
}

export function iterateLineHeightUtilities(
	cb: (step: number, canonicalClass: string) => void,
): void {
	for (const step of LINE_HEIGHT_STEPS) {
		cb(step, lineHeightUtilityClass(step));
	}
}

export function iterateDisplayUtilities(
	cb: (keyword: DisplayKeyword, canonicalClass: string) => void,
): void {
	for (const keyword of DISPLAY_KEYWORDS) {
		cb(keyword, displayUtilityClass(keyword));
	}
}

export function iterateShadowUtilities(cb: (name: string, canonicalClass: string) => void): void {
	for (const name of SHADOW_SIZE_NAMES) {
		cb(name, shadowUtilityClass(name));
	}
}

export function iterateIconUtilities(cb: (name: string, canonicalClass: string) => void): void {
	for (const name of ICON_SIZE_NAMES) {
		cb(name, iconUtilityClass(name));
	}
}

/** All canonical preset utility class names (sorted). */
export function collectPresetUtilityClassNames(): readonly string[] {
	const names = new Set<string>();

	iterateSpacingUtilities((_prefix, _name, canonicalClass) => {
		names.add(canonicalClass);
	});
	iterateGapUtilities((_name, canonicalClass) => {
		names.add(canonicalClass);
	});
	iterateColorUtilities((_token, foregroundClass, backgroundClass) => {
		names.add(foregroundClass);
		names.add(backgroundClass);
	});
	iterateFontFamilyUtilities((_name, canonicalClass) => {
		names.add(canonicalClass);
	});
	iterateFontSizeUtilities((_name, canonicalClass) => {
		names.add(canonicalClass);
	});
	iterateFontWeightUtilities((_step, canonicalClass) => {
		names.add(canonicalClass);
	});
	iterateLineHeightUtilities((_step, canonicalClass) => {
		names.add(canonicalClass);
	});
	iterateDisplayUtilities((_keyword, canonicalClass) => {
		names.add(canonicalClass);
	});
	iterateShadowUtilities((_name, canonicalClass) => {
		names.add(canonicalClass);
	});
	iterateIconUtilities((_name, canonicalClass) => {
		names.add(canonicalClass);
	});

	return [...names].sort();
}
