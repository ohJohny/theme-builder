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
} from '../utils/theme-token-spec';
import { SPACING_PREFIXES, type SpacingPrefix } from '../types/theme.js';
import {
	collectCustomClassEntries,
	resolveCustomClassName,
	resolveCustomClassOptions,
} from '../utils/custom-class-spec';
import { resolveUtilityClassFromMap } from './resolveUtilityClassFromMap';
import type { ColorTokenPair, IconSizeToken, TokenClass } from '../types/theme.js';
import type { Theme, ThemeConfigInput } from './types';

function parsePx(value: string): number | undefined {
	const trimmed = value.trim();
	const match = /^(-?\d+(?:\.\d+)?)(px)?$/.exec(trimmed);
	if (!match) return undefined;
	return Number(match[1]);
}

function buildColorTokenPair(
	token: string,
	classMap: Readonly<Record<string, string>>,
): ColorTokenPair {
	const { foreground, background } = colorUtilityClasses(token);
	const value = colorVarRef(token);
	return {
		foreground: {
			class: resolveUtilityClassFromMap(foreground, classMap),
			value,
		},
		background: {
			class: resolveUtilityClassFromMap(background, classMap),
			value,
		},
	};
}

export function buildThemeFromConfig<C extends ThemeConfigInput>(
	config: C,
	classMap: Readonly<Record<string, string>>,
): Theme<C> {
	const baseTokens = {} as Record<string, ColorTokenPair>;
	for (const name of Object.keys(config.colors?.base ?? {})) {
		baseTokens[name] = buildColorTokenPair(name, classMap);
	}

	const semanticTokens = {} as Record<string, ColorTokenPair>;
	for (const name of Object.keys(config.colors?.semantic ?? {})) {
		semanticTokens[name] = buildColorTokenPair(name, classMap);
	}

	const spacing = {} as Record<SpacingPrefix, Record<string, TokenClass>>;
	for (const prefix of SPACING_PREFIXES) {
		const group: Record<string, TokenClass> = {};
		for (const name of Object.keys(config.spacing ?? {})) {
			group[name] = {
				class: resolveUtilityClassFromMap(spacingUtilityClass(prefix, name), classMap),
				value: spaceVarRef(name),
			};
		}
		spacing[prefix] = group;
	}

	const gap = {} as Record<string, TokenClass>;
	for (const name of Object.keys(config.spacing ?? {})) {
		gap[name] = {
			class: resolveUtilityClassFromMap(gapUtilityClass(name), classMap),
			value: spaceVarRef(name),
		};
	}

	const family = {} as Record<string, TokenClass>;
	for (const name of Object.keys(config.fonts?.family ?? {})) {
		family[name] = {
			class: resolveUtilityClassFromMap(fontFamilyUtilityClass(name), classMap),
			value: fontFamilyVarRef(name),
		};
	}

	const size = {} as Record<string, TokenClass>;
	for (const name of Object.keys(config.fonts?.size ?? {})) {
		size[name] = {
			class: resolveUtilityClassFromMap(fontSizeUtilityClass(name), classMap),
			value: fontSizeVarRef(name),
		};
	}

	const weight = {} as Record<string, TokenClass>;
	for (const name of Object.keys(config.fonts?.weight ?? {})) {
		weight[name] = {
			class: resolveUtilityClassFromMap(fontWeightUtilityClass(name), classMap),
			value: fontWeightVarRef(name),
		};
	}

	const lineHeight = {} as Record<string, TokenClass>;
	for (const name of Object.keys(config.fonts?.lineHeight ?? {})) {
		lineHeight[name] = {
			class: resolveUtilityClassFromMap(lineHeightUtilityClass(name), classMap),
			value: lineHeightVarRef(name),
		};
	}

	const shadow = {} as Record<string, TokenClass>;
	for (const name of Object.keys(config.shadow ?? {})) {
		shadow[name] = {
			class: resolveUtilityClassFromMap(shadowUtilityClass(name), classMap),
			value: shadowVarRef(name),
		};
	}

	const icon = {} as Record<string, IconSizeToken>;
	for (const [name, rawValue] of Object.entries(config.icon ?? {})) {
		icon[name] = {
			class: resolveUtilityClassFromMap(iconUtilityClass(name), classMap),
			value: iconVarRef(name),
			px: parsePx(rawValue) ?? 0,
		};
	}

	const display = {} as Record<string, TokenClass>;
	for (const [name, keyword] of Object.entries(config.display ?? {})) {
		display[name] = {
			class: resolveUtilityClassFromMap(displayUtilityClass(name), classMap),
			value: keyword,
		};
	}

	const colors = {} as Record<string, string>;
	for (const name of Object.keys(config.colors?.base ?? {})) {
		colors[name] = colorVarRef(name);
	}
	for (const name of Object.keys(config.colors?.semantic ?? {})) {
		colors[name] = colorVarRef(name);
	}

	const customClassOptions = resolveCustomClassOptions(config.classes);
	const classes = {} as Record<string, { class: string }>;
	for (const { name } of collectCustomClassEntries(config)) {
		classes[name] = {
			class: resolveCustomClassName(name, customClassOptions),
		};
	}

	return {
		colors: colors as Theme<C>['colors'],
		colorUtilities: {
			base: { tokens: baseTokens as Theme<C>['colorUtilities']['base']['tokens'] },
			semantic: {
				tokens: semanticTokens as Theme<C>['colorUtilities']['semantic']['tokens'],
			},
		},
		spacing: spacing as Theme<C>['spacing'],
		gap: gap as Theme<C>['gap'],
		fonts: {
			family: family as Theme<C>['fonts']['family'],
			size: size as Theme<C>['fonts']['size'],
			weight: weight as Theme<C>['fonts']['weight'],
			lineHeight: lineHeight as Theme<C>['fonts']['lineHeight'],
		},
		icon: icon as Theme<C>['icon'],
		display: display as Theme<C>['display'],
		shadow: shadow as Theme<C>['shadow'],
		classes: classes as Theme<C>['classes'],
	} as Theme<C>;
}
