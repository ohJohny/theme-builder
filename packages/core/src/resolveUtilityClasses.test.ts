import { describe, expect, it } from 'vitest';

import { resolveUtilityClasses } from './resolveUtilityClasses';
import { createTestTheme } from './testFixtures';

describe('resolveUtilityClasses', () => {
	const { theme } = createTestTheme();

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
		const { className } = resolveUtilityClasses({ className: 'extra', p: 'sm' }, theme);
		expect(className).toContain('extra');
		expect(className).toContain(theme.spacing.p.sm.class);
	});
});
