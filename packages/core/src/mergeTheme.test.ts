import { describe, expect, it } from 'vitest';

import { buildThemeRaw } from './ThemeBuilder';
import { mergeTheme } from './mergeTheme';
import { resolvePaletteColor } from './resolvePaletteColor';

describe('mergeTheme', () => {
	it('merges custom colors into theme.colors', () => {
		const base = buildThemeRaw();
		const merged = mergeTheme(base, {
			colors: {
				brand: 'var(--color-brand)',
			},
		});

		expect(merged.colors.white).toBe('var(--color-white)');
		expect(merged.colors.brand).toBe('var(--color-brand)');
		expect(resolvePaletteColor(merged, 'brand')).toBe('var(--color-brand)');
	});

	it('overrides preset spacing token class', () => {
		const base = buildThemeRaw();
		const customClass = 'px-md-custom';
		const merged = mergeTheme(base, {
			spacing: {
				px: {
					md: { class: customClass, value: 'var(--space-md)' },
				},
			},
		});

		expect(merged.spacing.px.md.class).toBe(customClass);
		expect(merged.spacing.px.sm.class).toBe(base.spacing.px.sm.class);
	});

	it('merges semantic color utility tokens by name', () => {
		const base = buildThemeRaw();
		const merged = mergeTheme(base, {
			colorUtilities: {
				semantic: {
					tokens: {
						'brand-accent': {
							foreground: { class: 'color-brand-accent', value: 'var(--color-brand-accent)' },
							background: { class: 'bg-brand-accent', value: 'var(--color-brand-accent)' },
						},
					},
				},
			},
		});

		expect(
			(merged.colorUtilities.semantic.tokens as Record<string, unknown>)['brand-accent'],
		).toBeDefined();
		expect(resolvePaletteColor(merged, 'brand-accent')).toBe('var(--color-brand-accent)');
	});
});

describe('ThemeBuilder.extend', () => {
	it('rebuilds singleton theme after extend', async () => {
		const { ThemeBuilder } = await import('./ThemeBuilder');
		const builder = ThemeBuilder.getInstance();

		builder.extend({
			colors: { 'extend-test': 'var(--color-extend-test)' },
		});

		expect(builder.getTheme().colors['extend-test']).toBe('var(--color-extend-test)');
	});
});
