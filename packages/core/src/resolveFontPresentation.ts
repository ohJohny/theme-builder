import type { JSX } from 'solid-js';

import type {
    DisplayKeyword,
    FontSizeInputValue,
    FontWeightStep,
    LineHeightInputValue,
    Theme,
} from './types/theme.js';
import {
    resolveFontSizeName,
    resolveFontWeightStep,
    resolveLineHeightStep,
    spacingValueToCssLength,
} from './types/theme.js';

export function resolveFontPresentation(
    theme: Theme,
    value: FontSizeInputValue | undefined,
): { readonly class: string; readonly inline: JSX.CSSProperties } {
    if (value === undefined) {
        return { class: '', inline: {} };
    }
    const name = resolveFontSizeName(value);
    if (name !== undefined) {
        return { class: theme.fonts.size[name].class, inline: {} };
    }
    return {
        class: '',
        inline: { 'font-size': spacingValueToCssLength(value as number | string) } as JSX.CSSProperties,
    };
}

export function resolveFontWeightPresentation(
    theme: Theme,
    value: FontWeightStep | undefined,
): { readonly class: string; readonly inline: JSX.CSSProperties } {
    if (value === undefined) {
        return { class: '', inline: {} };
    }
    const step = resolveFontWeightStep(value);
    if (step !== undefined) {
        return { class: theme.fonts.weight[step].class, inline: {} };
    }
    return { class: '', inline: { 'font-weight': value } as JSX.CSSProperties };
}

export function resolveLineHeightPresentation(
    theme: Theme,
    value: LineHeightInputValue | undefined,
): { readonly class: string; readonly inline: JSX.CSSProperties } {
    if (value === undefined) {
        return { class: '', inline: {} };
    }
    const step = resolveLineHeightStep(value);
    if (step !== undefined) {
        return { class: theme.fonts.lineHeight[step].class, inline: {} };
    }
    return {
        class: '',
        inline: { 'line-height': value } as JSX.CSSProperties,
    };
}

export function resolveDisplayClass(theme: Theme, display: DisplayKeyword | undefined): string {
    return display !== undefined ? theme.display[display].class : '';
}
