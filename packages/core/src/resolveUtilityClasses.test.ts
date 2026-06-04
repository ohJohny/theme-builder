import { describe, expect, it } from 'vitest';

import { ThemeBuilder } from './ThemeBuilder';
import { resolveUtilityClasses } from './resolveUtilityClasses';

describe('resolveUtilityClasses', () => {
	const theme = ThemeBuilder.getInstance().getTheme();

	it('resolves spacing props to utility classes', () => {
		const { className, style } = resolveUtilityClasses({ px: 'md', py: 'sm' }, theme);
		expect(className).toContain(theme.spacing.px.md.class);
		expect(className).toContain(theme.spacing.py.sm.class);
		expect(style).toEqual({});
	});

	it('falls back to inline styles for arbitrary spacing', () => {
		const { className, style } = resolveUtilityClasses({ px: '13px' }, theme);
		expect(className).toBe('');
		expect(style).toMatchObject({
			'padding-inline-start': '13px',
			'padding-inline-end': '13px',
		});
	});

	it('resolves color and bg tokens to classes', () => {
		const { className } = resolveUtilityClasses(
			{ color: 'text-primary', bg: 'surface-main' },
			theme,
		);
		expect(className).toContain('color-text-primary');
		expect(className).toContain('bg-surface-main');
	});

	it('falls back to inline color for raw values', () => {
		const { className, style } = resolveUtilityClasses({ color: '#ff0000' }, theme);
		expect(className).toBe('');
		expect(style).toMatchObject({ color: '#ff0000' });
	});

	it('merges className pass-through', () => {
		const { className } = resolveUtilityClasses(
			{ className: 'custom', px: 'md' },
			theme,
		);
		expect(className).toMatch(/^custom /);
		expect(className).toContain(theme.spacing.px.md.class);
	});

	it('resolves typography and display props', () => {
		const { className } = resolveUtilityClasses(
			{
				fontSize: 'lg',
				fontWeight: 600,
				lineHeight: 150,
				display: 'flex',
				gap: 'md',
			},
			theme,
		);
		expect(className).toContain(theme.fonts.size.lg.class);
		expect(className).toContain(theme.fonts.weight[600].class);
		expect(className).toContain(theme.fonts.lineHeight[150].class);
		expect(className).toContain(theme.display.flex.class);
		expect(className).toContain(theme.gap.md.class);
	});
});
