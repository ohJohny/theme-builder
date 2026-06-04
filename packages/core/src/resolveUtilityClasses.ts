import type { JSX } from 'solid-js';

import { resolveColorPresentation } from './resolveColorPresentation';
import {
	resolveDisplayClass,
	resolveFontPresentation,
	resolveFontWeightPresentation,
	resolveLineHeightPresentation,
} from './resolveFontPresentation';
import { ThemeBuilder } from './ThemeBuilder';
import type {
	DisplayKeyword,
	FontFamilyName,
	FontSizeInputValue,
	FontWeightStep,
	IconSizeInputValue,
	LineHeightInputValue,
	ShadowInputValue,
	SpacingInputValue,
	SpacingPrefix,
	Theme,
} from './types/theme.js';
import {
	isShadowSizeName,
	resolveIconSizeName,
	resolveSpacingSizeName,
	spacingPrefixToStyle,
	spacingValueToCssLength,
} from './types/theme.js';

const SPACING_PREFIXES_LIST: readonly SpacingPrefix[] = [
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

export type UtilityProps = {
	readonly className?: string;
	readonly color?: string;
	readonly bg?: string;
	readonly gap?: SpacingInputValue;
	readonly font?: FontFamilyName;
	readonly fontSize?: FontSizeInputValue;
	readonly fontWeight?: FontWeightStep | number;
	readonly lineHeight?: LineHeightInputValue;
	readonly display?: DisplayKeyword;
	readonly shadow?: ShadowInputValue;
	readonly icon?: IconSizeInputValue;
} & {
	readonly [K in SpacingPrefix]?: SpacingInputValue;
};

export type UtilityClassesResult = {
	readonly className: string;
	readonly style: JSX.CSSProperties;
};

function mergePresentation(
	classes: string[],
	inline: JSX.CSSProperties,
	part: { readonly class: string; readonly inline: JSX.CSSProperties },
): void {
	if (part.class) {
		classes.push(part.class);
	}
	Object.assign(inline, part.inline);
}

function resolveSpacingProp(
	theme: Theme,
	prefix: SpacingPrefix,
	value: SpacingInputValue,
): { readonly class: string; readonly inline: JSX.CSSProperties } {
	const name = resolveSpacingSizeName(value);
	if (name !== undefined) {
		return { class: theme.spacing[prefix][name].class, inline: {} };
	}
	const length =
		typeof value === 'number' || typeof value === 'string'
			? spacingValueToCssLength(value)
			: undefined;
	if (length === undefined) {
		return { class: '', inline: {} };
	}
	return { class: '', inline: spacingPrefixToStyle(prefix, length) as JSX.CSSProperties };
}

function resolveGapProp(
	theme: Theme,
	value: SpacingInputValue,
): { readonly class: string; readonly inline: JSX.CSSProperties } {
	const name = resolveSpacingSizeName(value);
	if (name !== undefined) {
		return { class: theme.gap[name].class, inline: {} };
	}
	if (typeof value === 'number' || typeof value === 'string') {
		return {
			class: '',
			inline: { gap: spacingValueToCssLength(value) } as JSX.CSSProperties,
		};
	}
	return { class: '', inline: {} };
}

function resolveFontFamilyProp(
	theme: Theme,
	value: FontFamilyName,
): { readonly class: string; readonly inline: JSX.CSSProperties } {
	return { class: theme.fonts.family[value].class, inline: {} };
}

function resolveShadowProp(
	theme: Theme,
	value: ShadowInputValue,
): { readonly class: string; readonly inline: JSX.CSSProperties } {
	if (typeof value === 'string' && isShadowSizeName(value)) {
		return { class: theme.shadow[value].class, inline: {} };
	}
	if (typeof value === 'string') {
		return { class: '', inline: { 'box-shadow': value } as JSX.CSSProperties };
	}
	return { class: '', inline: {} };
}

function resolveIconProp(
	theme: Theme,
	value: IconSizeInputValue,
): { readonly class: string; readonly inline: JSX.CSSProperties } {
	const name = resolveIconSizeName(value);
	if (name !== undefined) {
		return { class: theme.icon[name].class, inline: {} };
	}
	if (typeof value === 'number') {
		const px = `${value}px`;
		return { class: '', inline: { width: px, height: px } as JSX.CSSProperties };
	}
	return { class: '', inline: {} };
}

/**
 * Resolves JSX-style utility props to `className` + inline `style`.
 * Known tokens map to utility classes; arbitrary values fall back to inline CSS.
 */
export function resolveUtilityClasses(
	props: UtilityProps,
	theme: Theme = ThemeBuilder.getInstance().getTheme(),
): UtilityClassesResult {
	const classes: string[] = [];
	const inline: JSX.CSSProperties = {};

	if (props.className) {
		classes.push(props.className);
	}

	for (const prefix of SPACING_PREFIXES_LIST) {
		const value = props[prefix];
		if (value !== undefined) {
			mergePresentation(classes, inline, resolveSpacingProp(theme, prefix, value));
		}
	}

	if (props.gap !== undefined) {
		mergePresentation(classes, inline, resolveGapProp(theme, props.gap));
	}

	if (props.color !== undefined) {
		mergePresentation(
			classes,
			inline,
			resolveColorPresentation(theme, props.color, 'foreground'),
		);
	}

	if (props.bg !== undefined) {
		mergePresentation(classes, inline, resolveColorPresentation(theme, props.bg, 'background'));
	}

	if (props.font !== undefined) {
		mergePresentation(classes, inline, resolveFontFamilyProp(theme, props.font));
	}

	if (props.fontSize !== undefined) {
		mergePresentation(classes, inline, resolveFontPresentation(theme, props.fontSize));
	}

	if (props.fontWeight !== undefined) {
		mergePresentation(
			classes,
			inline,
			resolveFontWeightPresentation(theme, props.fontWeight as FontWeightStep),
		);
	}

	if (props.lineHeight !== undefined) {
		mergePresentation(classes, inline, resolveLineHeightPresentation(theme, props.lineHeight));
	}

	if (props.display !== undefined) {
		const displayClass = resolveDisplayClass(theme, props.display);
		if (displayClass) {
			classes.push(displayClass);
		}
	}

	if (props.shadow !== undefined) {
		mergePresentation(classes, inline, resolveShadowProp(theme, props.shadow));
	}

	if (props.icon !== undefined) {
		mergePresentation(classes, inline, resolveIconProp(theme, props.icon));
	}

	return {
		className: classes.filter(Boolean).join(' '),
		style: inline,
	};
}
