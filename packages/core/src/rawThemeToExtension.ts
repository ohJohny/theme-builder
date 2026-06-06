import {
	colorUtilityClasses,
	colorVarRef,
	displayUtilityClass,
	fontFamilyUtilityClass,
	fontFamilyVarRef,
	fontSizeUtilityClass,
	fontSizeVarRef,
	fontWeightUtilityClass,
	fontWeightVarRef,
	gapUtilityClass,
	iconUtilityClass,
	iconVarRef,
	lineHeightUtilityClass,
	lineHeightVarRef,
	shadowUtilityClass,
	shadowVarRef,
	spaceVarRef,
	spacingUtilityClass,
} from './utils/theme-token-spec';

import {
	SPACING_PREFIXES,
	type ColorTokenPair,
	type FontWeightStep,
	type IconSizeToken,
	type TokenClass,
} from './types/theme.js';

import type { ThemeExtension } from './mergeTheme';
import type { RawThemeConfig } from './rawThemeConfig';

function tokenClass(canonicalClass: string, cssVar: string): TokenClass {
	return { class: canonicalClass, value: cssVar };
}

function colorTokenPair(name: string): ColorTokenPair {
	const { foreground, background } = colorUtilityClasses(name);
	const cssVar = colorVarRef(name);
	return {
		foreground: tokenClass(foreground, cssVar),
		background: tokenClass(background, cssVar),
	};
}

function parseIconPx(value: string): number | undefined {
	const trimmed = value.trim();
	if (trimmed.endsWith('px')) {
		const n = Number.parseFloat(trimmed.slice(0, -2));
		return Number.isFinite(n) ? n : undefined;
	}
	const n = Number.parseFloat(trimmed);
	return Number.isFinite(n) ? n : undefined;
}

function iconToken(name: string, rawValue: string): IconSizeToken {
	return {
		class: iconUtilityClass(name),
		value: iconVarRef(name),
		px: parseIconPx(rawValue) ?? 16,
	};
}

/** Builds a `ThemeExtension` from raw JSON token definitions (no DOM). */
export function rawThemeConfigToExtension(config: RawThemeConfig): ThemeExtension {
	const extension: Record<string, unknown> = {};

	if (config.colors) {
		const colors: Record<string, string> = {};
		const semanticTokens: Record<string, ColorTokenPair> = {};
		for (const name of Object.keys(config.colors)) {
			colors[name] = colorVarRef(name);
			semanticTokens[name] = colorTokenPair(name);
		}
		extension.colors = colors;
		extension.colorUtilities = {
			semantic: { tokens: semanticTokens },
		};
	}

	if (config.spacing) {
		const spacing: Record<string, Record<string, TokenClass>> = {};
		for (const prefix of SPACING_PREFIXES) {
			const group: Record<string, TokenClass> = {};
			for (const name of Object.keys(config.spacing)) {
				group[name] = tokenClass(spacingUtilityClass(prefix, name), spaceVarRef(name));
			}
			spacing[prefix] = group;
		}
		extension.spacing = spacing;
	}

	if (config.gap) {
		const gap: Record<string, TokenClass> = {};
		for (const name of Object.keys(config.gap)) {
			gap[name] = tokenClass(gapUtilityClass(name), spaceVarRef(name));
		}
		extension.gap = gap;
	}

	if (config.fonts) {
		const fonts: Record<string, unknown> = {};
		if (config.fonts.size) {
			const size: Record<string, TokenClass> = {};
			for (const name of Object.keys(config.fonts.size)) {
				size[name] = tokenClass(fontSizeUtilityClass(name), fontSizeVarRef(name));
			}
			fonts.size = size;
		}
		if (config.fonts.weight) {
			const weight = {} as Partial<Record<FontWeightStep, TokenClass>>;
			for (const name of Object.keys(config.fonts.weight)) {
				const step = Number(name) as FontWeightStep;
				weight[step] = tokenClass(fontWeightUtilityClass(name), fontWeightVarRef(name));
			}
			fonts.weight = weight;
		}
		if (config.fonts.lineHeight) {
			const lineHeight = {} as Record<string, TokenClass>;
			for (const name of Object.keys(config.fonts.lineHeight)) {
				lineHeight[name] = tokenClass(
					lineHeightUtilityClass(name),
					lineHeightVarRef(name),
				);
			}
			fonts.lineHeight = lineHeight;
		}
		if (config.fonts.family) {
			const family: Record<string, TokenClass> = {};
			for (const name of Object.keys(config.fonts.family)) {
				family[name] = tokenClass(fontFamilyUtilityClass(name), fontFamilyVarRef(name));
			}
			fonts.family = family;
		}
		if (Object.keys(fonts).length > 0) {
			extension.fonts = fonts;
		}
	}

	if (config.shadow) {
		const shadow: Record<string, TokenClass> = {};
		for (const name of Object.keys(config.shadow)) {
			shadow[name] = tokenClass(shadowUtilityClass(name), shadowVarRef(name));
		}
		extension.shadow = shadow;
	}

	if (config.icon) {
		const icon: Record<string, IconSizeToken> = {};
		for (const [name, value] of Object.entries(config.icon)) {
			icon[name] = iconToken(name, value);
		}
		extension.icon = icon;
	}

	if (config.display) {
		const display: Record<string, TokenClass> = {};
		for (const [name, keyword] of Object.entries(config.display)) {
			display[name] = tokenClass(displayUtilityClass(name), keyword);
		}
		extension.display = display;
	}

	return extension as ThemeExtension;
}
