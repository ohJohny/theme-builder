import type { JSX } from 'solid-js';

import { resolveColorPresentation } from './resolveColorPresentation';
import {
	resolveDisplayClass,
	resolveFontPresentation,
	resolveFontWeightPresentation,
	resolveLineHeightPresentation,
} from './resolveFontPresentation';
import { ThemeBuilder } from './ThemeBuilder';
import type { UtilityPresentation } from './types/presentation';
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
	SPACING_PREFIXES,
	isShadowSizeName,
	resolveIconSizeName,
	resolveSpacingSizeName,
	spacingPrefixToStyle,
	spacingValueToCssLength,
} from './types/theme.js';

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
	part: UtilityPresentation,
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
): UtilityPresentation {
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
): UtilityPresentation {
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
): UtilityPresentation {
	return { class: theme.fonts.family[value].class, inline: {} };
}

function resolveShadowProp(
	theme: Theme,
	value: ShadowInputValue,
): UtilityPresentation {
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
): UtilityPresentation {
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

type PresentationResolver = (
	theme: Theme,
	props: UtilityProps,
) => UtilityPresentation | undefined;

const PROP_RESOLVERS: readonly PresentationResolver[] = [
	(theme, props) =>
		props.gap !== undefined ? resolveGapProp(theme, props.gap) : undefined,
	(theme, props) =>
		props.color !== undefined
			? resolveColorPresentation(theme, props.color, 'foreground')
			: undefined,
	(theme, props) =>
		props.bg !== undefined
			? resolveColorPresentation(theme, props.bg, 'background')
			: undefined,
	(theme, props) =>
		props.font !== undefined ? resolveFontFamilyProp(theme, props.font) : undefined,
	(theme, props) =>
		props.fontSize !== undefined
			? resolveFontPresentation(theme, props.fontSize)
			: undefined,
	(theme, props) =>
		props.fontWeight !== undefined
			? resolveFontWeightPresentation(theme, props.fontWeight as FontWeightStep)
			: undefined,
	(theme, props) =>
		props.lineHeight !== undefined
			? resolveLineHeightPresentation(theme, props.lineHeight)
			: undefined,
	(theme, props) =>
		props.shadow !== undefined ? resolveShadowProp(theme, props.shadow) : undefined,
	(theme, props) =>
		props.icon !== undefined ? resolveIconProp(theme, props.icon) : undefined,
];

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

	for (const prefix of SPACING_PREFIXES) {
		const value = props[prefix];
		if (value !== undefined) {
			mergePresentation(classes, inline, resolveSpacingProp(theme, prefix, value));
		}
	}

	for (const resolve of PROP_RESOLVERS) {
		const presentation = resolve(theme, props);
		if (presentation !== undefined) {
			mergePresentation(classes, inline, presentation);
		}
	}

	if (props.display !== undefined) {
		const displayClass = resolveDisplayClass(theme, props.display);
		if (displayClass) {
			classes.push(displayClass);
		}
	}

	return {
		className: classes.filter(Boolean).join(' '),
		style: inline,
	};
}
