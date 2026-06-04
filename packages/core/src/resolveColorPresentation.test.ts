import { describe, expect, it } from 'vitest';

import { ThemeBuilder } from './ThemeBuilder';

const theme = ThemeBuilder.getInstance().getTheme();

import { resolveColorPresentation } from './resolveColorPresentation';
import { resolveColorToken, resolvePaletteColor } from './resolvePaletteColor';

describe('resolveColorToken', () => {
    it('resolves base colors', () => {
        expect(resolveColorToken(theme, 'white')).toBe('var(--color-white)');
        expect(resolveColorToken(theme, 'black')).toBe('var(--color-black)');
    });

    it('resolves semantic tokens', () => {
        expect(resolveColorToken(theme, 'text-primary')).toBe('var(--color-text-primary)');
        expect(resolveColorToken(theme, 'surface-main')).toBe('var(--color-surface-main)');
    });

    it('returns undefined for raw CSS', () => {
        expect(resolveColorToken(theme, '#ff0000')).toBeUndefined();
        expect(resolveColorToken(theme, 'gray-500')).toBeUndefined();
    });
});

describe('resolvePaletteColor', () => {
    it('resolves semantic tokens via colorUtilities', () => {
        expect(resolvePaletteColor(theme, 'text-secondary')).toBe(
            'var(--color-text-secondary)',
        );
    });
});

describe('resolveColorPresentation', () => {
    it('maps base foreground to color utility class', () => {
        const pres = resolveColorPresentation(theme, 'white', 'foreground');
        expect(pres.class).toBe('color-white');
        expect(pres.inline).toEqual({});
    });

    it('maps semantic background to bg utility class', () => {
        const pres = resolveColorPresentation(theme, 'surface-main', 'background');
        expect(pres.class).toBe('bg-surface-main');
        expect(pres.inline).toEqual({});
    });

    it('uses inline style for raw CSS colors', () => {
        const pres = resolveColorPresentation(theme, '#336699', 'foreground');
        expect(pres.class).toBe('');
        expect(pres.inline).toEqual({ color: '#336699' });
    });

    it('uses inline background for gradients', () => {
        const pres = resolveColorPresentation(
            theme,
            'linear-gradient(180deg, #000, #fff)',
            'background',
        );
        expect(pres.class).toBe('');
        expect(pres.inline).toEqual({
            background: 'linear-gradient(180deg, #000, #fff)',
        });
    });
});
