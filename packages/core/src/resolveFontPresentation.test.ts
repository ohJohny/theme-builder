import { describe, expect, it } from 'vitest';

import {
	resolveFontWeightPresentation,
	resolveLineHeightPresentation,
} from './resolveFontPresentation';
import { createTestTheme } from './testFixtures';

const { theme } = createTestTheme();

describe('resolveFontWeightPresentation', () => {
	it('maps font weight steps to utility classes', () => {
		const pres = resolveFontWeightPresentation(theme, 600);
		expect(pres.class).toBe('font-weight-600');
		expect(pres.inline).toEqual({});
	});
});

describe('resolveLineHeightPresentation', () => {
	it('maps line height steps to lh utility classes', () => {
		const pres = resolveLineHeightPresentation(theme, '150');
		expect(pres.class).toBe('lh-150');
		expect(pres.inline).toEqual({});
	});

	it('uses inline style for unitless non-token values', () => {
		const pres = resolveLineHeightPresentation(theme, 1.5);
		expect(pres.class).toBe('');
		expect(pres.inline).toEqual({ 'line-height': 1.5 });
	});
});
