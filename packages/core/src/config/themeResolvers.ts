import type { Theme, ThemeConfigInput } from './types';

export function hasSpacingName(theme: Theme<ThemeConfigInput>, name: string): boolean {
	return name in theme.spacing.p;
}

export function hasFontSizeName(theme: Theme<ThemeConfigInput>, name: string): boolean {
	return name in theme.fonts.size;
}

export function hasFontWeightName(theme: Theme<ThemeConfigInput>, name: string | number): boolean {
	return String(name) in theme.fonts.weight;
}

export function hasLineHeightName(theme: Theme<ThemeConfigInput>, name: string | number): boolean {
	return String(name) in theme.fonts.lineHeight;
}

export function hasShadowName(theme: Theme<ThemeConfigInput>, name: string): boolean {
	return name in theme.shadow;
}

export function hasIconSizeName(theme: Theme<ThemeConfigInput>, name: string): boolean {
	return name in theme.icon;
}

export function hasDisplayName(theme: Theme<ThemeConfigInput>, name: string): boolean {
	return name in theme.display;
}

export function hasFontFamilyName(theme: Theme<ThemeConfigInput>, name: string): boolean {
	return name in theme.fonts.family;
}

export function resolveSpacingName(
	theme: Theme<ThemeConfigInput>,
	value: string | number,
): string | undefined {
	if (typeof value === 'string' && hasSpacingName(theme, value)) {
		return value;
	}
	return undefined;
}

export function resolveFontSizeName(
	theme: Theme<ThemeConfigInput>,
	value: string | number,
): string | undefined {
	if (typeof value === 'string' && hasFontSizeName(theme, value)) {
		return value;
	}
	return undefined;
}

export function resolveIconSizeName(
	theme: Theme<ThemeConfigInput>,
	value: string | number,
): string | undefined {
	if (typeof value === 'string' && hasIconSizeName(theme, value)) {
		return value;
	}
	if (typeof value === 'number') {
		for (const [name, token] of Object.entries(theme.icon)) {
			if (token.px === value) return name;
		}
	}
	return undefined;
}

export function resolveFontWeightName(
	theme: Theme<ThemeConfigInput>,
	value: string | number,
): string | undefined {
	const key = String(value);
	return hasFontWeightName(theme, key) ? key : undefined;
}

export function resolveLineHeightName(
	theme: Theme<ThemeConfigInput>,
	value: string | number,
): string | undefined {
	const key = String(value);
	return hasLineHeightName(theme, key) ? key : undefined;
}

export function resolveShadowName(theme: Theme<ThemeConfigInput>, value: string): string | undefined {
	return hasShadowName(theme, value) ? value : undefined;
}

export function resolveDisplayName(theme: Theme<ThemeConfigInput>, value: string): string | undefined {
	return hasDisplayName(theme, value) ? value : undefined;
}

export function resolveFontFamilyName(
	theme: Theme<ThemeConfigInput>,
	value: string,
): string | undefined {
	return hasFontFamilyName(theme, value) ? value : undefined;
}
