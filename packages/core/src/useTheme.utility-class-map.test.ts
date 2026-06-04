import { describe, expect, it } from 'vitest';

import { hashUtilityClass } from './helpers/utility-class-hash';
import { buildUtilityClassMap } from './helpers/utility-class-map';
import { collectUtilityClassNames } from './helpers/utility-class-catalog';
import { ThemeBuilder } from './ThemeBuilder';
import { resolveUtilityClass, UTILITY_CLASS_MAP_MODE } from './utilityClassMap';

describe('ThemeBuilder utility class map', () => {
	it('uses identity map in test/dev setup', () => {
		const theme = ThemeBuilder.getInstance().getTheme();
		expect(UTILITY_CLASS_MAP_MODE).toBe('identity');
		expect(theme.spacing.px.md.class).toBe('px-md');
		expect(theme.gap.sm.class).toBe('gap-sm');
		expect(theme.colorUtilities.semantic.tokens['text-primary'].foreground.class).toBe(
			'color-text-primary',
		);
		expect(theme.display.flex.class).toBe('d-flex');
	});

	it('resolveUtilityClass returns theme class strings', () => {
		const theme = ThemeBuilder.getInstance().getTheme();
		expect(resolveUtilityClass('px-md')).toBe(theme.spacing.px.md.class);
		expect(resolveUtilityClass('gap-sm')).toBe(theme.gap.sm.class);
	});

	it('resolveUtilityClass throws for unknown keys', () => {
		expect(() => resolveUtilityClass('not-a-utility')).toThrow(/unknown utility class/);
	});

	it('hashed map values align with hashUtilityClass for full catalog', () => {
		const catalog = collectUtilityClassNames();
		const hashed = buildUtilityClassMap('hashed', catalog);
		for (const canonical of catalog) {
			expect(hashed[canonical]).toBe(hashUtilityClass(canonical));
		}
	});
});
