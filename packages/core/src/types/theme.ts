/**
 * Theme token types and canonical axis values. Keep in sync with:
 * - `src/styles/theme/_scale-maps.scss`
 * - `src/styles/theme/presets/default-theme.scss` (semantic `--color-*` tokens)
 * - `src/styles/theme/_color-utilities.scss` (`.color-*` / `.bg-*` utilities)
 * - `src/styles/_unspecified-default-colors.scss`
 * - `src/styles/theme/_spacing.scss` (padding, margin, **gap** utilities)
 * - `src/styles/theme/_fonts.scss`
 * - `src/styles/theme/_icons.scss`
 * - `src/styles/theme/_display.scss`
 *
 * `src/lib/theme/useTheme.ts` builds the runtime `Theme` object from these shapes.
 */

import {
	expandLogicalAxisDeclaration,
	isLogicalAxisProperty,
} from './logical-axis-expand';

/** Named spacing scale for components (maps to numeric steps in SCSS). */
export type SpacingSizeName =
	| 'zero'
	| 'smallest'
	| 'tiny'
	| 'xs'
	| 'sm'
	| 'md'
	| 'mdl'
	| 'lg'
	| 'xl'
	| 'xxl'
	| 'giant';

/** Named font-size scale for components (maps to design `text-*` steps). */
export type FontSizeName =
	| 'xs'
	| 'xsplus'
	| 'sm'
	| 'md'
	| 'mdl'
	| 'lg'
	| 'xl'
	| 'xxl'
	| 'giant';

/** Named Lucide / inline icon box scale (`icon-*` utilities). */
export type IconSizeName = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Named elevation scale (`shadow-*` utilities). Same keys as spacing. */
export type ShadowSizeName = SpacingSizeName;

/** Shared component dimension / gap preset names. */
export type ComponentSizeName = SpacingSizeName;

/**
 * Augment in a consumer repo for typed custom palette keys:
 * `declare module '@ohJohny/theme-builder/core' { interface ThemeColorOverrides { brand: string } }`
 */
export interface ThemeColorOverrides {}

export type ThemeColors = {
	readonly white: string;
	readonly black: string;
} & ThemeColorOverrides &
	Record<string, string>;

export type BaseColorTokenName = 'white' | 'black';

/**
 * Augment for custom semantic color utility tokens:
 * `declare module '@ohJohny/theme-builder/core' { interface SemanticColorTokenOverrides { 'brand-accent': never } }`
 * Use `never` as value type when only extending the key union.
 */
export interface SemanticColorTokenOverrides {}

export type SemanticColorTokenName =
	| keyof SemanticColorTokenOverrides
	| 'text-primary'
	| 'text-secondary'
	| 'text-tertiary'
	| 'text-active'
	| 'text-link'
	| 'text-error'
	| 'text-disable'
	| 'surface-main'
	| 'surface-container'
	| 'surface-sidebar'
	| 'surface-overlay'
	| 'surface-inpunt-mask'
	| 'surface-inpunt-active'
	| 'surface-input-mask'
	| 'surface-input-active'
	| 'border-default'
	| 'border-active'
	| 'border-divider'
	| 'border-error'
	| 'body-default'
	| 'body-hover'
	| 'body-active'
	| 'action-primary-default'
	| 'action-primary-hover'
	| 'action-primary-active'
	| 'action-primary-disabled'
	| 'action-secondary-default'
	| 'action-secondary-hover'
	| 'action-secondary-active'
	| 'action-secondary-disabled';

export type ColorTokenName = BaseColorTokenName | SemanticColorTokenName;

export interface ColorTokenPair {
	readonly foreground: TokenClass;
	readonly background: TokenClass;
}

export interface ThemeBaseColorUtilities {
	readonly tokens: Readonly<Record<BaseColorTokenName, ColorTokenPair>>;
}

export interface ThemeSemanticColorUtilities {
	readonly tokens: Readonly<Record<SemanticColorTokenName, ColorTokenPair>>;
}

export interface ThemeColorUtilities {
	readonly base: ThemeBaseColorUtilities;
	readonly semantic: ThemeSemanticColorUtilities;
}

/** Legacy numeric steps still accepted as input; theme leaves are keyed by name. */
export type SpacingStep =
	| 4
	| 6
	| 8
	| 12
	| 16
	| 20
	| 24
	| 32
	| 36
	| 40
	| 48;

export type SpacingPrefix =
	| 'p'
	| 'pt'
	| 'pb'
	| 'pl'
	| 'pr'
	| 'px'
	| 'py'
	| 'm'
	| 'mt'
	| 'mb'
	| 'ml'
	| 'mr'
	| 'mx'
	| 'my';

export interface TokenClass {
	readonly class: string;
	readonly value: string;
}

export interface IconSizeToken extends TokenClass {
	readonly px: number;
}

export type SpacingGroup = Readonly<Record<SpacingSizeName, TokenClass>>;
export type ThemeSpacing = Readonly<Record<SpacingPrefix, SpacingGroup>>;

/** `gap-*` utilities from `_spacing.scss` (semantic names). */
export type GapScale = Readonly<Record<SpacingSizeName, TokenClass>>;

export type FontSizeStep = 12 | 13 | 14 | 16 | 20 | 24 | 32 | 40 | 48;
export type IconSizeStep = 14 | 16 | 20 | 24 | 32;
export type FontWeightStep = 300 | 400 | 500 | 600 | 700 | 800;
export type LineHeightStep = 100 | 125 | 150 | 175 | 200;
export type FontFamilyName = 'sans' | 'mono';

export interface ThemeFonts {
	readonly family: Readonly<Record<FontFamilyName, TokenClass>>;
	readonly size: Readonly<Record<FontSizeName, TokenClass>>;
	readonly weight: Readonly<Record<FontWeightStep, TokenClass>>;
	readonly lineHeight: Readonly<Record<LineHeightStep, TokenClass>>;
}

export type DisplayKeyword =
	| 'none'
	| 'block'
	| 'inline'
	| 'inline-block'
	| 'flex'
	| 'inline-flex'
	| 'grid'
	| 'inline-grid'
	| 'table'
	| 'inline-table'
	| 'table-cell'
	| 'contents'
	| 'flow-root';

export type ThemeDisplay = Readonly<Record<DisplayKeyword, TokenClass>>;

export type ShadowScale = Readonly<Record<ShadowSizeName, TokenClass>>;

export type IconSizeScale = Readonly<Record<IconSizeName, IconSizeToken>>;

export interface Theme {
	readonly colors: ThemeColors;
	readonly colorUtilities: ThemeColorUtilities;
	readonly spacing: ThemeSpacing;
	readonly gap: GapScale;
	readonly fonts: ThemeFonts;
	readonly icon: IconSizeScale;
	readonly display: ThemeDisplay;
	readonly shadow: ShadowScale;
}

export const BASE_COLOR_TOKEN_NAMES = ['white', 'black'] as const satisfies readonly BaseColorTokenName[];

export const SEMANTIC_COLOR_TOKEN_NAMES = [
	'text-primary',
	'text-secondary',
	'text-tertiary',
	'text-active',
	'text-link',
	'text-error',
	'text-disable',
	'surface-main',
	'surface-container',
	'surface-sidebar',
	'surface-overlay',
	'surface-inpunt-mask',
	'surface-inpunt-active',
	'surface-input-mask',
	'surface-input-active',
	'border-default',
	'border-active',
	'border-divider',
	'border-error',
	'body-default',
	'body-hover',
	'body-active',
	'action-primary-default',
	'action-primary-hover',
	'action-primary-active',
	'action-primary-disabled',
	'action-secondary-default',
	'action-secondary-hover',
	'action-secondary-active',
	'action-secondary-disabled',
] as const satisfies readonly SemanticColorTokenName[];

export function isBaseColorTokenName(s: string): s is BaseColorTokenName {
	return (BASE_COLOR_TOKEN_NAMES as readonly string[]).includes(s);
}

export function isSemanticColorTokenName(s: string): s is SemanticColorTokenName {
	return (SEMANTIC_COLOR_TOKEN_NAMES as readonly string[]).includes(s);
}

export function isColorTokenName(s: string): s is ColorTokenName {
	return isBaseColorTokenName(s) || isSemanticColorTokenName(s);
}
export const SPACING_STEPS: readonly SpacingStep[] = [
	4, 6, 8, 12, 16, 20, 24, 32, 36, 40, 48,
];
export const SPACING_PREFIXES: readonly SpacingPrefix[] = [
	'p',
	'pt',
	'pb',
	'pl',
	'pr',
	'px',
	'py',
	'm',
	'mt',
	'mb',
	'ml',
	'mr',
	'mx',
	'my',
];

/** CSS property for each spacing prefix; mirrors `_spacing.scss`. */
export const SPACING_PREFIX_CSS_PROPERTY: Readonly<Record<SpacingPrefix, string>> = {
	p: 'padding',
	pt: 'padding-block-start',
	pb: 'padding-block-end',
	pl: 'padding-inline-start',
	pr: 'padding-inline-end',
	px: 'padding-inline',
	py: 'padding-block',
	m: 'margin',
	mt: 'margin-block-start',
	mb: 'margin-block-end',
	ml: 'margin-inline-start',
	mr: 'margin-inline-end',
	mx: 'margin-inline',
	my: 'margin-block',
};
export const FONT_SIZE_STEPS: readonly FontSizeStep[] = [
	12, 13, 14, 16, 20, 24, 32, 40, 48,
];
export const ICON_SIZE_STEPS: readonly IconSizeStep[] = [14, 16, 20, 24, 32];
export const FONT_WEIGHT_STEPS: readonly FontWeightStep[] = [
	300, 400, 500, 600, 700, 800,
];
export const LINE_HEIGHT_STEPS: readonly LineHeightStep[] = [
	100, 125, 150, 175, 200,
];
export const FONT_FAMILY_NAMES: readonly FontFamilyName[] = ['sans', 'mono'];

export const DISPLAY_KEYWORDS: readonly DisplayKeyword[] = [
	'none',
	'block',
	'inline',
	'inline-block',
	'flex',
	'inline-flex',
	'grid',
	'inline-grid',
	'table',
	'inline-table',
	'table-cell',
	'contents',
	'flow-root',
];

export const SPACING_SIZE_NAMES = [
	'zero',
	'smallest',
	'tiny',
	'xs',
	'sm',
	'md',
	'mdl',
	'lg',
	'xl',
	'xxl',
	'giant',
] as const satisfies readonly SpacingSizeName[];

export const FONT_SIZE_NAMES = [
	'xs',
	'xsplus',
	'sm',
	'md',
	'mdl',
	'lg',
	'xl',
	'xxl',
	'giant',
] as const satisfies readonly FontSizeName[];

export const ICON_SIZE_NAMES = [
	'xs',
	'sm',
	'md',
	'lg',
	'xl',
] as const satisfies readonly IconSizeName[];

export const SHADOW_SIZE_NAMES = SPACING_SIZE_NAMES satisfies readonly ShadowSizeName[];

/** Canonical spacing scale — keep in sync with `_scale-maps.scss` `$spacing-scale`. */
export const SPACING_SCALE: Readonly<Record<SpacingSizeName, number>> = {
	zero: 0,
	smallest: 4,
	tiny: 6,
	xs: 8,
	sm: 12,
	md: 16,
	mdl: 20,
	lg: 24,
	xl: 32,
	xxl: 40,
	giant: 48,
};

/** Canonical font-size scale — keep in sync with `_scale-maps.scss` `$font-size-scale`. */
export const FONT_SIZE_SCALE: Readonly<Record<FontSizeName, number>> = {
	xs: 12,
	xsplus: 13,
	sm: 14,
	md: 16,
	mdl: 20,
	lg: 24,
	xl: 32,
	xxl: 40,
	giant: 48,
};

/** Canonical icon box scale (px) — keep in sync with `_scale-maps.scss` `$icon-size-scale`. */
export const ICON_SIZE_SCALE: Readonly<Record<IconSizeName, number>> = {
	xs: 14,
	sm: 16,
	md: 20,
	lg: 24,
	xl: 32,
};

/** Shadow scale keys — values live in `_scale-maps.scss` `$shadow-scale` (full `box-shadow` strings). */
export const SHADOW_SCALE: Readonly<Record<ShadowSizeName, string>> = {
	zero: 'none',
	smallest: '0 1px 2px rgba(0, 0, 0, 0.05)',
	tiny: '0 1px 2px rgba(0, 0, 0, 0.05)',
	xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
	sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
	mdl: '0 0.125rem 1rem rgba(0, 0, 0, 0.08), 0 0.5rem 1.75rem rgba(0, 0, 0, 0.065)',
	md: '0 0.25rem 1.5rem rgba(0, 0, 0, 0.08), 0 0.75rem 2.5rem rgba(0, 0, 0, 0.06)',
	lg: '0 0.5rem 2rem rgba(0, 0, 0, 0.1), 0 1rem 3rem rgba(0, 0, 0, 0.08)',
	xl: '0 0.75rem 2.5rem rgba(0, 0, 0, 0.12), 0 1.25rem 4rem rgba(0, 0, 0, 0.1)',
	xxl: '0 1rem 3rem rgba(0, 0, 0, 0.14), 0 1.5rem 5rem rgba(0, 0, 0, 0.12)',
	giant: '0 1.25rem 4rem rgba(0, 0, 0, 0.16), 0 2rem 6rem rgba(0, 0, 0, 0.14)',
};

const SPACING_STEP_TO_NAME: Partial<Record<SpacingStep, SpacingSizeName>> =
	Object.fromEntries(
		SPACING_SIZE_NAMES.map((name) => [SPACING_SCALE[name], name] as const),
	) as Partial<Record<SpacingStep, SpacingSizeName>>;

const FONT_SIZE_STEP_TO_NAME: Partial<Record<FontSizeStep, FontSizeName>> =
	Object.fromEntries(
		FONT_SIZE_NAMES.map((name) => [FONT_SIZE_SCALE[name], name] as const),
	) as Partial<Record<FontSizeStep, FontSizeName>>;

const ICON_SIZE_STEP_TO_NAME: Partial<Record<IconSizeStep, IconSizeName>> =
	Object.fromEntries(
		ICON_SIZE_NAMES.map((name) => [ICON_SIZE_SCALE[name], name] as const),
	) as Partial<Record<IconSizeStep, IconSizeName>>;

export function isSpacingStep(n: number): n is SpacingStep {
	return (SPACING_STEPS as readonly number[]).includes(n);
}

export function isFontSizeStep(n: number): n is FontSizeStep {
	return (FONT_SIZE_STEPS as readonly number[]).includes(n);
}

export function isIconSizeStep(n: number): n is IconSizeStep {
	return (ICON_SIZE_STEPS as readonly number[]).includes(n);
}

export function isFontWeightStep(n: number): n is FontWeightStep {
	return (FONT_WEIGHT_STEPS as readonly number[]).includes(n);
}

export function isLineHeightStep(n: number): n is LineHeightStep {
	return (LINE_HEIGHT_STEPS as readonly number[]).includes(n);
}

export function isSpacingSizeName(s: string): s is SpacingSizeName {
	return (SPACING_SIZE_NAMES as readonly string[]).includes(s);
}

export function isFontSizeName(s: string): s is FontSizeName {
	return (FONT_SIZE_NAMES as readonly string[]).includes(s);
}

export function isIconSizeName(s: string): s is IconSizeName {
	return (ICON_SIZE_NAMES as readonly string[]).includes(s);
}

export function isShadowSizeName(s: string): s is ShadowSizeName {
	return (SHADOW_SIZE_NAMES as readonly string[]).includes(s);
}

/** Values accepted on layout props: semantic name, token step, or arbitrary CSS length. */
export type SpacingInputValue = SpacingSizeName | SpacingStep | number | string;

export type FontSizeInputValue = FontSizeName | FontSizeStep | number | string;

export type IconSizeInputValue = IconSizeName | IconSizeStep | number;

export type LineHeightInputValue = LineHeightStep | number | string;

export type ShadowInputValue = ShadowSizeName | (string & {});

export function resolveSpacingSizeName(
	value: SpacingInputValue,
): SpacingSizeName | undefined {
	if (typeof value === 'string') {
		if (isSpacingSizeName(value)) {
			return value;
		}
		const n = Number(value);
		if (Number.isFinite(n) && Number.isInteger(n)) {
			return SPACING_STEP_TO_NAME[n as SpacingStep];
		}
		return undefined;
	}
	if (typeof value === 'number' && Number.isInteger(value)) {
		return SPACING_STEP_TO_NAME[value as SpacingStep];
	}
	return undefined;
}

export function resolveFontSizeName(value: FontSizeInputValue): FontSizeName | undefined {
	if (typeof value === 'string') {
		if (isFontSizeName(value)) {
			return value;
		}
		const n = Number(value);
		if (Number.isFinite(n) && Number.isInteger(n)) {
			return FONT_SIZE_STEP_TO_NAME[n as FontSizeStep];
		}
		return undefined;
	}
	if (typeof value === 'number' && Number.isInteger(value)) {
		return FONT_SIZE_STEP_TO_NAME[value as FontSizeStep];
	}
	return undefined;
}

export function resolveIconSizeName(value: IconSizeInputValue): IconSizeName | undefined {
	if (typeof value === 'string') {
		if (isIconSizeName(value)) {
			return value;
		}
		const n = Number(value);
		if (Number.isFinite(n) && Number.isInteger(n)) {
			return ICON_SIZE_STEP_TO_NAME[n as IconSizeStep];
		}
		return undefined;
	}
	if (typeof value === 'number' && Number.isInteger(value)) {
		return ICON_SIZE_STEP_TO_NAME[value as IconSizeStep];
	}
	return undefined;
}

/** Resolves a spacing input to its numeric px step when it matches the design scale. */
export function resolveSpacingStepToken(value: SpacingInputValue): SpacingStep | undefined {
	const name = resolveSpacingSizeName(value);
	if (name !== undefined) {
		const step = SPACING_SCALE[name];
		return isSpacingStep(step) ? step : undefined;
	}
	if (typeof value === 'number' && isSpacingStep(value)) {
		return value;
	}
	if (typeof value === 'string') {
		const n = Number(value);
		if (Number.isFinite(n) && Number.isInteger(n) && isSpacingStep(n)) {
			return n;
		}
	}
	return undefined;
}

export function resolveFontSizeStepToken(value: FontSizeInputValue): FontSizeStep | undefined {
	const name = resolveFontSizeName(value);
	if (name !== undefined) {
		const step = FONT_SIZE_SCALE[name];
		return isFontSizeStep(step) ? step : undefined;
	}
	if (typeof value === 'number' && isFontSizeStep(value)) {
		return value;
	}
	if (typeof value === 'string') {
		const n = Number(value);
		if (Number.isFinite(n) && Number.isInteger(n) && isFontSizeStep(n)) {
			return n;
		}
	}
	return undefined;
}

/** CSS `var(--space-<name>)` for a resolved spacing input, or undefined for arbitrary lengths. */
export function resolveSpacingCssVar(value: SpacingInputValue): string | undefined {
	const name = resolveSpacingSizeName(value);
	return name !== undefined ? `var(--space-${name})` : undefined;
}

/** CSS `var(--font-size-<name>)` for a resolved font-size input. */
export function resolveFontSizeCssVar(value: FontSizeInputValue): string | undefined {
	const name = resolveFontSizeName(value);
	return name !== undefined ? `var(--font-size-${name})` : undefined;
}

export function resolveIconSizeCssVar(value: IconSizeInputValue): string | undefined {
	const name = resolveIconSizeName(value);
	return name !== undefined ? `var(--icon-size-${name})` : undefined;
}

export function resolveLineHeightStep(value: LineHeightInputValue): LineHeightStep | undefined {
	if (typeof value === 'number' && Number.isInteger(value) && isLineHeightStep(value)) {
		return value;
	}
	if (typeof value === 'string') {
		const n = Number(value);
		if (Number.isFinite(n) && Number.isInteger(n) && isLineHeightStep(n)) {
			return n;
		}
	}
	return undefined;
}

export function resolveFontWeightStep(value: number): FontWeightStep | undefined {
	return isFontWeightStep(value) ? value : undefined;
}

/** CSS `var(--lh-<step>)` for a resolved line-height token step. */
export function resolveLhCssVar(value: LineHeightInputValue): string | undefined {
	const step = resolveLineHeightStep(value);
	return step !== undefined ? `var(--lh-${step})` : undefined;
}

/** CSS `var(--shadow-<name>)` for a semantic shadow name. */
export function resolveShadowCssVar(value: ShadowInputValue): string | undefined {
	if (typeof value === 'string' && isShadowSizeName(value)) {
		return `var(--shadow-${value})`;
	}
	return undefined;
}

/** CSS `var(--color-<token>)` for a palette or semantic color token name. */
export function resolveColorCssVar(token: ColorTokenName): string {
	return `var(--color-${token})`;
}

/** Unitless numeric string → px; otherwise unchanged. */
export function spacingValueToCssLength(value: number | string): string {
	if (typeof value === 'number') {
		return `${value}px`;
	}
	const t = value.trim();
	if (/^\d+(\.\d+)?$/.test(t)) {
		return `${t}px`;
	}
	return value;
}

/**
 * Inline style fragment for a spacing prefix when no utility class applies
 * (arbitrary length).
 */
export function spacingPrefixToStyle(
	prefix: SpacingPrefix,
	cssLength: string,
): Record<string, string> {
	const prop = SPACING_PREFIX_CSS_PROPERTY[prefix];
	if (isLogicalAxisProperty(prop)) {
		return expandLogicalAxisDeclaration(prop, cssLength);
	}
	return { [prop]: cssLength };
}
