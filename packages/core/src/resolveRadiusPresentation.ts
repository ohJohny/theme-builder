import type { JSX } from 'solid-js';

import { resolveRadiusName } from './config/themeResolvers';
import type { UtilityPresentation } from './types/presentation';
import type { Theme, ThemeConfigInput } from './types/theme.js';
import { spacingValueToCssLength } from './types/theme.js';

export function resolveRadiusPresentation(
	theme: Theme<ThemeConfigInput>,
	value: string | number,
): UtilityPresentation {
	const name = resolveRadiusName(theme, value);
	if (name !== undefined) {
		return { class: theme.radius[name].class, inline: {} };
	}
	if (typeof value === 'number' || typeof value === 'string') {
		return {
			class: '',
			inline: { 'border-radius': spacingValueToCssLength(value) } as JSX.CSSProperties,
		};
	}
	return { class: '', inline: {} };
}
