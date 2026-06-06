import type { JSX } from 'solid-js';

import {
	resolveDisplayName,
	resolveFontSizeName,
	resolveFontWeightName,
	resolveLineHeightName,
} from './config/themeResolvers';
import type { UtilityPresentation } from './types/presentation';
import type { Theme, ThemeConfigInput } from './types/theme.js';
import { spacingValueToCssLength } from './types/theme.js';

export function resolveFontPresentation(
	theme: Theme<ThemeConfigInput>,
	value: string | number | undefined,
): UtilityPresentation {
	if (value === undefined) {
		return { class: '', inline: {} };
	}
	const name = resolveFontSizeName(theme, value);
	if (name !== undefined) {
		return { class: theme.fonts.size[name].class, inline: {} };
	}
	return {
		class: '',
		inline: { 'font-size': spacingValueToCssLength(value) } as JSX.CSSProperties,
	};
}

export function resolveFontWeightPresentation(
	theme: Theme<ThemeConfigInput>,
	value: string | number | undefined,
): UtilityPresentation {
	if (value === undefined) {
		return { class: '', inline: {} };
	}
	const name = resolveFontWeightName(theme, value);
	if (name !== undefined) {
		return { class: theme.fonts.weight[name].class, inline: {} };
	}
	return { class: '', inline: { 'font-weight': value } as JSX.CSSProperties };
}

export function resolveLineHeightPresentation(
	theme: Theme<ThemeConfigInput>,
	value: string | number | undefined,
): UtilityPresentation {
	if (value === undefined) {
		return { class: '', inline: {} };
	}
	const name = resolveLineHeightName(theme, value);
	if (name !== undefined) {
		return { class: theme.fonts.lineHeight[name].class, inline: {} };
	}
	return {
		class: '',
		inline: { 'line-height': value } as JSX.CSSProperties,
	};
}

export function resolveDisplayClass(
	theme: Theme<ThemeConfigInput>,
	display: string | undefined,
): string {
	if (display === undefined) return '';
	const name = resolveDisplayName(theme, display);
	return name !== undefined ? theme.display[name].class : '';
}
