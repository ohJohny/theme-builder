import type { ColorTokenPair, Theme, ThemeConfigInput } from './types/theme.js';

function themeColorsRecord(theme: Theme<ThemeConfigInput>): Record<string, string> {
	return theme.colors as Record<string, string>;
}

function semanticTokens(theme: Theme<ThemeConfigInput>): Record<string, ColorTokenPair> {
	return theme.colorUtilities.semantic.tokens as Record<string, ColorTokenPair>;
}

function baseTokens(theme: Theme<ThemeConfigInput>): Record<string, ColorTokenPair> {
	return theme.colorUtilities.base.tokens as Record<string, ColorTokenPair>;
}

function lookupColorTokenPair(
	theme: Theme<ThemeConfigInput>,
	token: string,
): ColorTokenPair | undefined {
	if (Object.prototype.hasOwnProperty.call(semanticTokens(theme), token)) {
		return semanticTokens(theme)[token];
	}
	if (Object.prototype.hasOwnProperty.call(baseTokens(theme), token)) {
		return baseTokens(theme)[token];
	}
	return undefined;
}

/** Resolves a theme color name to its CSS `var(--color-*)` value or `theme.colors` entry. */
export function resolveColorToken(theme: Theme<ThemeConfigInput>, input: string): string | undefined {
	if (Object.prototype.hasOwnProperty.call(themeColorsRecord(theme), input)) {
		return themeColorsRecord(theme)[input];
	}

	const pair = lookupColorTokenPair(theme, input);
	return pair?.foreground.value;
}

/** Resolves a color token shorthand or returns `input` as raw CSS. */
export function resolvePaletteColor(theme: Theme<ThemeConfigInput>, input: string): string {
	return resolveColorToken(theme, input) ?? input;
}

export function lookupColorTokenPresentation(
	theme: Theme<ThemeConfigInput>,
	input: string,
): ColorTokenPair | undefined {
	return lookupColorTokenPair(theme, input);
}
