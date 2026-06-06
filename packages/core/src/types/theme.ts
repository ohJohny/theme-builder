/**
 * Theme infrastructure types and CSS property mappings.
 * Token catalogs are defined per-consumer via `defineThemeConfig`.
 */

import {
	expandLogicalAxisDeclaration,
	isLogicalAxisProperty,
} from './logical-axis-expand';

export type {
	Theme,
	ThemeConfigInput,
	UtilityProps,
	CreatedTheme,
	SchemeName,
	ColorName,
	SpacingName,
	SpacingInputValue,
	FontSizeInputValue,
	IconSizeInputValue,
	LineHeightInputValue,
	ShadowInputValue,
} from '../config/types';

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

export interface ColorTokenPair {
	readonly foreground: TokenClass;
	readonly background: TokenClass;
}

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
