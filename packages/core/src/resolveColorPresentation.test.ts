import { describe, expect, it } from 'vitest';

import { resolveColorPresentation } from './resolveColorPresentation';
import { resolveColorToken, resolvePaletteColor } from './resolvePaletteColor';
import { createTestTheme } from './testFixtures';

const { theme } = createTestTheme();

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
	});
});

describe('resolvePaletteColor', () => {
	it('resolves semantic tokens via colorUtilities', () => {
		expect(resolvePaletteColor(theme, 'text-primary')).toBe('var(--color-text-primary)');
	});

	it('returns raw CSS when not a token', () => {
		expect(resolvePaletteColor(theme, '#ff0000')).toBe('#ff0000');
	});
});

describe('resolveColorPresentation', () => {
	it('returns foreground utility class for semantic token', () => {
		const pres = resolveColorPresentation(theme, 'text-primary', 'foreground');
		expect(pres.class).toBe('color-text-primary');
	});

	it('returns background utility class for semantic token', () => {
		const pres = resolveColorPresentation(theme, 'surface-main', 'background');
		expect(pres.class).toBe('bg-surface-main');
	});
});
