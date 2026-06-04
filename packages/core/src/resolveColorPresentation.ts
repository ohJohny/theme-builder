import type { JSX } from 'solid-js';

import type { Theme } from './types/theme.js';

import { lookupColorTokenPresentation, resolvePaletteColor } from './resolvePaletteColor';

export type ColorPresentationRole = 'foreground' | 'background';

export type ColorPresentation = {
    readonly class: string;
    readonly inline: JSX.CSSProperties;
};

function isGradientOrImage(value: string): boolean {
    return /gradient\s*\(/i.test(value) || /\burl\s*\(/i.test(value);
}

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
    if (role === 'background' && isGradientOrImage(resolved)) {
        return { class: '', inline: { background: resolved } };
    }

    if (role === 'foreground') {
        return { class: '', inline: { color: resolved } };
    }

    return { class: '', inline: { 'background-color': resolved } };
}
