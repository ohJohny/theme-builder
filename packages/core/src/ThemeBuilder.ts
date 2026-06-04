import { mergeTheme, type ThemeExtension } from './mergeTheme';
import { resolveUtilityClass } from './utilityClassMap';

import type {
	BaseColorTokenName,
	ColorTokenPair,
	DisplayKeyword,
	GapScale,
	IconSizeScale,
	ShadowScale,
	Theme,
	ThemeBaseColorUtilities,
	ThemeColorUtilities,
	ThemeColors,
	ThemeDisplay,
	ThemeFonts,
	ThemeSemanticColorUtilities,
} from './types/theme.js';
import {
	BASE_COLOR_TOKEN_NAMES,
	DISPLAY_KEYWORDS,
	FONT_FAMILY_NAMES,
	FONT_SIZE_NAMES,
	FONT_WEIGHT_STEPS,
	ICON_SIZE_NAMES,
	ICON_SIZE_SCALE,
	LINE_HEIGHT_STEPS,
	SEMANTIC_COLOR_TOKEN_NAMES,
	SHADOW_SIZE_NAMES,
	SPACING_PREFIXES,
	SPACING_SIZE_NAMES,
	type FontFamilyName,
	type FontSizeName,
	type IconSizeName,
	type IconSizeToken,
	type FontWeightStep,
	type LineHeightStep,
	type SemanticColorTokenName,
	type ShadowSizeName,
	type SpacingGroup,
	type SpacingPrefix,
	type SpacingSizeName,
	type TokenClass,
} from './types/theme.js';

function buildColorTokenPair(token: string): ColorTokenPair {
	return {
		foreground: {
			class: resolveUtilityClass(`color-${token}`),
			value: `var(--color-${token})`,
		},
		background: {
			class: resolveUtilityClass(`bg-${token}`),
			value: `var(--color-${token})`,
		},
	};
}

function buildBaseColorUtilities(): ThemeBaseColorUtilities {
	const tokens = {} as Record<BaseColorTokenName, ColorTokenPair>;
	for (const name of BASE_COLOR_TOKEN_NAMES) {
		tokens[name] = buildColorTokenPair(name);
	}
	return { tokens };
}

function buildSemanticColorUtilities(): ThemeSemanticColorUtilities {
	const tokens = {} as Record<SemanticColorTokenName, ColorTokenPair>;
	for (const name of SEMANTIC_COLOR_TOKEN_NAMES) {
		tokens[name] = buildColorTokenPair(name);
	}
	return { tokens };
}

function buildColorUtilities(): ThemeColorUtilities {
	return {
		base: buildBaseColorUtilities(),
		semantic: buildSemanticColorUtilities(),
	};
}

function buildSpacingGroup(prefix: SpacingPrefix): SpacingGroup {
	const group = {} as Record<SpacingSizeName, TokenClass>;
	for (const name of SPACING_SIZE_NAMES) {
		group[name] = {
			class: resolveUtilityClass(`${prefix}-${name}`),
			value: `var(--space-${name})`,
		};
	}
	return group;
}

function buildGap(): GapScale {
	const gap = {} as Record<SpacingSizeName, TokenClass>;
	for (const name of SPACING_SIZE_NAMES) {
		gap[name] = {
			class: resolveUtilityClass(`gap-${name}`),
			value: `var(--space-${name})`,
		};
	}
	return gap;
}

function buildFonts(): ThemeFonts {
	const family = {} as Record<FontFamilyName, TokenClass>;
	for (const name of FONT_FAMILY_NAMES) {
		family[name] = {
			class: resolveUtilityClass(`font-${name}`),
			value: `var(--font-family-${name})`,
		};
	}

	const size = {} as Record<FontSizeName, TokenClass>;
	for (const name of FONT_SIZE_NAMES) {
		size[name] = {
			class: resolveUtilityClass(`text-${name}`),
			value: `var(--font-size-${name})`,
		};
	}

	const weight = {} as Record<FontWeightStep, TokenClass>;
	for (const step of FONT_WEIGHT_STEPS) {
		weight[step] = {
			class: resolveUtilityClass(`font-weight-${step}`),
			value: `var(--font-weight-${step})`,
		};
	}

	const lineHeight = {} as Record<LineHeightStep, TokenClass>;
	for (const step of LINE_HEIGHT_STEPS) {
		lineHeight[step] = {
			class: resolveUtilityClass(`lh-${step}`),
			value: `var(--lh-${step})`,
		};
	}

	return { family, size, weight, lineHeight };
}

function buildColors(): ThemeColors {
	return {
		white: 'var(--color-white)',
		black: 'var(--color-black)',
	};
}

function buildSpacing(): Theme['spacing'] {
	const spacing = {} as Record<SpacingPrefix, SpacingGroup>;
	for (const prefix of SPACING_PREFIXES) {
		spacing[prefix] = buildSpacingGroup(prefix);
	}
	return spacing;
}

function buildDisplay(): ThemeDisplay {
	const display = {} as Record<DisplayKeyword, TokenClass>;
	for (const key of DISPLAY_KEYWORDS) {
		display[key] = {
			class: resolveUtilityClass(`d-${key}`),
			value: key,
		};
	}
	return display;
}

function buildShadow(): ShadowScale {
	const shadow = {} as Record<ShadowSizeName, TokenClass>;
	for (const name of SHADOW_SIZE_NAMES) {
		shadow[name] = {
			class: resolveUtilityClass(`shadow-${name}`),
			value: `var(--shadow-${name})`,
		};
	}
	return shadow;
}

function buildIconSizes(): IconSizeScale {
	const icon = {} as Record<IconSizeName, IconSizeToken>;
	for (const name of ICON_SIZE_NAMES) {
		icon[name] = {
			class: resolveUtilityClass(`icon-${name}`),
			value: `var(--icon-size-${name})`,
			px: ICON_SIZE_SCALE[name],
		};
	}
	return icon;
}

const PROXY_PATH = Symbol('theme.path');

interface ProxyMeta {
	readonly [PROXY_PATH]: string;
}

const ALLOWED_MISSING_KEYS = new Set<string>([
	'then',
	'toJSON',
	'toString',
	'valueOf',
	'asymmetricMatch',
	'nodeType',
	'$$typeof',
	Symbol.toPrimitive.toString(),
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
	if (value === null || typeof value !== 'object') return false;
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}

function wrapInProxy<T>(value: T, path: string): T {
	if (!isPlainObject(value)) return value;

	const wrappedEntries: Record<string, unknown> = {};
	for (const key of Object.keys(value)) {
		const childPath = path ? `${path}.${key}` : key;
		wrappedEntries[key] = wrapInProxy(value[key], childPath);
	}

	Object.defineProperty(wrappedEntries, PROXY_PATH, {
		value: path,
		enumerable: false,
		writable: false,
		configurable: false,
	});
	Object.freeze(wrappedEntries);

	return new Proxy(wrappedEntries, {
		get(target, prop, receiver) {
			if (typeof prop === 'symbol') {
				return Reflect.get(target, prop, receiver);
			}
			if (Object.prototype.hasOwnProperty.call(target, prop)) {
				return Reflect.get(target, prop, receiver);
			}
			if (ALLOWED_MISSING_KEYS.has(prop)) {
				return undefined;
			}
			const currentPath = (target as unknown as ProxyMeta)[PROXY_PATH];
			const fullPath = currentPath ? `${currentPath}.${prop}` : String(prop);
			throw new ReferenceError(`[ThemeBuilder] token "${fullPath}" does not exist`);
		},
		set(_target, prop) {
			const currentPath = (_target as unknown as ProxyMeta)[PROXY_PATH];
			const fullPath = currentPath ? `${currentPath}.${String(prop)}` : String(prop);
			throw new TypeError(`[ThemeBuilder] cannot assign to read-only token "${fullPath}"`);
		},
		deleteProperty(_target, prop) {
			const currentPath = (_target as unknown as ProxyMeta)[PROXY_PATH];
			const fullPath = currentPath ? `${currentPath}.${String(prop)}` : String(prop);
			throw new TypeError(`[ThemeBuilder] cannot delete read-only token "${fullPath}"`);
		},
	}) as T;
}

export function buildThemeRaw(): Theme {
	return {
		colors: buildColors(),
		colorUtilities: buildColorUtilities(),
		spacing: buildSpacing(),
		gap: buildGap(),
		fonts: buildFonts(),
		icon: buildIconSizes(),
		display: buildDisplay(),
		shadow: buildShadow(),
	};
}

/** Framework-agnostic theme singleton (runtime token tree + proxy guards). */
export class ThemeBuilder {
	private static instance: ThemeBuilder | undefined;
	private themeValue: Theme;
	private readonly extensions: ThemeExtension[] = [];

	private constructor() {
		this.themeValue = wrapInProxy(buildThemeRaw(), '');
	}

	static getInstance(): ThemeBuilder {
		if (ThemeBuilder.instance === undefined) {
			ThemeBuilder.instance = new ThemeBuilder();
		}
		return ThemeBuilder.instance;
	}

	/** Merges `extension` after the built-in preset (and any prior `extend` calls). */
	extend(extension: ThemeExtension): this {
		this.extensions.push(extension);
		this.rebuild();
		return this;
	}

	getTheme(): Theme {
		return this.themeValue;
	}

	private rebuild(): void {
		const merged = mergeTheme(buildThemeRaw(), ...this.extensions);
		this.themeValue = wrapInProxy(merged, '');
	}
}
