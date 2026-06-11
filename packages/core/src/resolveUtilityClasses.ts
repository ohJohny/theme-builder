import type { JSX } from 'solid-js';

import { resolveColorPresentation } from './resolveColorPresentation';
import {
	resolveDisplayClass,
	resolveFontPresentation,
	resolveFontWeightPresentation,
	resolveLineHeightPresentation,
} from './resolveFontPresentation';
import {
	resolveFontFamilyName,
	resolveFontSizeName,
	resolveIconSizeName,
	resolveMotionDurationName,
	resolveOpacityName,
	resolveShadowName,
	resolveSpacingName,
	resolveZIndexName,
} from './config/themeResolvers';
import type {
	ResolveUtilityClassesOptions,
	UtilityProps as ConfigUtilityProps,
} from './config/types';
import { resolveRadiusPresentation } from './resolveRadiusPresentation';
import { resolveResponsiveSpacingValue } from './resolveResponsiveSpacing';
import type { UtilityPresentation } from './types/presentation';
import type { SpacingPrefix, Theme, ThemeConfigInput } from './types/theme.js';
import { SPACING_PREFIXES, spacingPrefixToStyle, spacingValueToCssLength } from './types/theme.js';

export type UtilityProps<C extends ThemeConfigInput = ThemeConfigInput> = ConfigUtilityProps<C>;

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
	theme: Theme<ThemeConfigInput>,
	prefix: SpacingPrefix,
	value: string | number,
): UtilityPresentation {
	const name = resolveSpacingName(theme, value);
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
	theme: Theme<ThemeConfigInput>,
	value: NonNullable<UtilityProps['gap']>,
	deviceMatches?: ResolveUtilityClassesOptions['deviceMatches'],
): UtilityPresentation {
	const resolved = resolveResponsiveSpacingValue(value, deviceMatches);
	if (resolved === undefined) {
		return { class: '', inline: {} };
	}
	const name = resolveSpacingName(theme, resolved);
	if (name !== undefined) {
		return { class: theme.gap[name].class, inline: {} };
	}
	if (typeof resolved === 'number' || typeof resolved === 'string') {
		return {
			class: '',
			inline: { gap: spacingValueToCssLength(resolved) } as JSX.CSSProperties,
		};
	}
	return { class: '', inline: {} };
}

function resolveFontFamilyProp(
	theme: Theme<ThemeConfigInput>,
	value: string,
): UtilityPresentation {
	const name = resolveFontFamilyName(theme, value);
	if (name === undefined) {
		return { class: '', inline: {} };
	}
	return { class: theme.fonts.family[name].class, inline: {} };
}

function resolveShadowProp(
	theme: Theme<ThemeConfigInput>,
	value: string,
): UtilityPresentation {
	const name = resolveShadowName(theme, value);
	if (name !== undefined) {
		return { class: theme.shadow[name].class, inline: {} };
	}
	return { class: '', inline: { 'box-shadow': value } as JSX.CSSProperties };
}

function resolveIconProp(
	theme: Theme<ThemeConfigInput>,
	value: string | number,
): UtilityPresentation {
	const name = resolveIconSizeName(theme, value);
	if (name !== undefined) {
		return { class: theme.icon[name].class, inline: {} };
	}
	if (typeof value === 'number') {
		const px = `${value}px`;
		return { class: '', inline: { width: px, height: px } as JSX.CSSProperties };
	}
	return { class: '', inline: {} };
}

function resolveTransitionProp(
	theme: Theme<ThemeConfigInput>,
	value: string,
): UtilityPresentation {
	const name = resolveMotionDurationName(theme, value);
	if (name !== undefined) {
		return { class: theme.motion.duration[name].class, inline: {} };
	}
	return { class: '', inline: { 'transition-duration': value } as JSX.CSSProperties };
}

function resolveOpacityProp(
	theme: Theme<ThemeConfigInput>,
	value: string | number,
): UtilityPresentation {
	const name = resolveOpacityName(theme, value);
	if (name !== undefined) {
		return { class: theme.opacity[name].class, inline: {} };
	}
	if (typeof value === 'number' || typeof value === 'string') {
		return { class: '', inline: { opacity: String(value) } as JSX.CSSProperties };
	}
	return { class: '', inline: {} };
}

function resolveZIndexProp(
	theme: Theme<ThemeConfigInput>,
	value: string | number,
): UtilityPresentation {
	const name = resolveZIndexName(theme, value);
	if (name !== undefined) {
		return { class: theme.zIndex[name].class, inline: {} };
	}
	if (typeof value === 'number' || typeof value === 'string') {
		return { class: '', inline: { 'z-index': String(value) } as JSX.CSSProperties };
	}
	return { class: '', inline: {} };
}

type PresentationResolver = (
	theme: Theme<ThemeConfigInput>,
	props: UtilityProps,
	options: ResolveUtilityClassesOptions,
) => UtilityPresentation | undefined;

const PROP_RESOLVERS: readonly PresentationResolver[] = [
	(theme, props, options) =>
		props.gap !== undefined ? resolveGapProp(theme, props.gap, options.deviceMatches) : undefined,
	(theme, props, _options) =>
		props.color !== undefined
			? resolveColorPresentation(theme, props.color, 'foreground')
			: undefined,
	(theme, props, _options) =>
		props.bg !== undefined
			? resolveColorPresentation(theme, props.bg, 'background')
			: undefined,
	(theme, props, _options) =>
		props.font !== undefined ? resolveFontFamilyProp(theme, props.font) : undefined,
	(theme, props, _options) =>
		props.fontSize !== undefined
			? resolveFontPresentation(theme, props.fontSize)
			: undefined,
	(theme, props, _options) =>
		props.fontWeight !== undefined
			? resolveFontWeightPresentation(theme, props.fontWeight)
			: undefined,
	(theme, props, _options) =>
		props.lineHeight !== undefined
			? resolveLineHeightPresentation(theme, props.lineHeight)
			: undefined,
	(theme, props, _options) =>
		props.shadow !== undefined ? resolveShadowProp(theme, props.shadow) : undefined,
	(theme, props, _options) =>
		props.radius !== undefined
			? resolveRadiusPresentation(theme, props.radius)
			: undefined,
	(theme, props, _options) =>
		props.transition !== undefined
			? resolveTransitionProp(theme, props.transition)
			: undefined,
	(theme, props, _options) =>
		props.opacity !== undefined ? resolveOpacityProp(theme, props.opacity) : undefined,
	(theme, props, _options) =>
		props.zIndex !== undefined ? resolveZIndexProp(theme, props.zIndex) : undefined,
	(theme, props, _options) =>
		props.icon !== undefined ? resolveIconProp(theme, props.icon) : undefined,
];

export function resolveUtilityClasses<C extends ThemeConfigInput>(
	props: UtilityProps<C>,
	theme: Theme<C>,
	options: ResolveUtilityClassesOptions = {},
): UtilityClassesResult {
	const classes: string[] = [];
	const inline: JSX.CSSProperties = {};

	if (props.className) {
		classes.push(props.className);
	}

	for (const prefix of SPACING_PREFIXES) {
		const value = props[prefix];
		if (value !== undefined) {
			const resolved = resolveResponsiveSpacingValue(value, options.deviceMatches);
			if (resolved !== undefined) {
				mergePresentation(
					classes,
					inline,
					resolveSpacingProp(theme as Theme<ThemeConfigInput>, prefix, resolved),
				);
			}
		}
	}

	for (const resolve of PROP_RESOLVERS) {
		const presentation = resolve(theme as Theme<ThemeConfigInput>, props, options);
		if (presentation !== undefined) {
			mergePresentation(classes, inline, presentation);
		}
	}

	if (props.display !== undefined) {
		const displayClass = resolveDisplayClass(theme as Theme<ThemeConfigInput>, props.display);
		if (displayClass) {
			classes.push(displayClass);
		}
	}

	return {
		className: classes.filter(Boolean).join(' '),
		style: inline,
	};
}
