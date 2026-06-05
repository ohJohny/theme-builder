import { describe, expect, it } from 'vitest';

import { collectUtilityClassNames } from './utility-class-catalog';
import { hashUtilityClass } from './utility-class-hash';
import { buildUtilityClassMap, rewriteUtilityCss } from './utility-class-map';

describe('utility-class-map', () => {
	it('catalog includes spacing, color, and display utilities', () => {
		const catalog = collectUtilityClassNames();
		expect(catalog).toContain('px-md');
		expect(catalog).toContain('gap-sm');
		expect(catalog).toContain('color-text-primary');
		expect(catalog).toContain('bg-surface-main');
		expect(catalog).toContain('d-flex');
		expect(catalog).toContain('shadow-md');
		expect(catalog).toContain('icon-lg');
	});

	it('identity map leaves canonical names unchanged', () => {
		const map = buildUtilityClassMap('identity', ['px-md', 'py-sm']);
		expect(map['px-md']).toBe('px-md');
		expect(map['py-sm']).toBe('py-sm');
	});

	it('hashed map rewrites CSS selectors', () => {
		const map = buildUtilityClassMap('hashed', ['px-md', 'p-md']);
		const css = '.px-md { padding: 1rem; } .p-md { padding: 0.5rem; }';
		const rewritten = rewriteUtilityCss(css, map);
		expect(rewritten).not.toContain('.px-md');
		expect(rewritten).not.toContain('.p-md');
		expect(rewritten).toContain(`.${map['px-md']}`);
		expect(rewritten).toContain(`.${map['p-md']}`);
	});

	it('identity map does not rewrite CSS', () => {
		const map = buildUtilityClassMap('identity', ['px-md']);
		const css = '.px-md { padding: 1rem; }';
		expect(rewriteUtilityCss(css, map)).toBe(css);
	});

	it('hashed map matches hashUtilityClass for every catalog entry', () => {
		const catalog = collectUtilityClassNames();
		const map = buildUtilityClassMap('hashed', catalog);
		for (const canonical of catalog) {
			expect(map[canonical]).toBe(hashUtilityClass(canonical));
		}
	});
});
