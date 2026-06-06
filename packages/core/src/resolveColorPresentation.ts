import { isSolidPaintCssValue } from './isSolidPaintCssValue';
import { lookupColorTokenPresentation, resolvePaletteColor } from './resolvePaletteColor';
import type { UtilityPresentation } from './types/presentation';
import type { Theme } from './types/theme.js';

export type ColorPresentationRole = 'foreground' | 'background';

export type ColorPresentation = UtilityPresentation;

export function resolveColorPresentation(
    theme: Theme,
    input: string | undefined,
    role: ColorPresentationRole,
): ColorPresentation {
    if (input === undefined) {
        return { class: '', inline: {} };
    }

    const token = lookupColorTokenPresentation(theme, input);
    if (token !== undefined) {
        const utility = role === 'foreground' ? token.foreground : token.background;
        return { class: utility.class, inline: {} };
    }

    const resolved = resolvePaletteColor(theme, input);
    if (role === 'background' && !isSolidPaintCssValue(resolved)) {
        return { class: '', inline: { background: resolved } };
    }

    if (role === 'foreground') {
        return { class: '', inline: { color: resolved } };
    }

    return { class: '', inline: { 'background-color': resolved } };
}
