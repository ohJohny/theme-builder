import { describe, expect, it } from 'vitest';

import { defineThemeConfig } from '../config/defineThemeConfig';
import { validateThemeConfig } from '../config/validateThemeConfig';
import {
	buildCustomClassRule,
	collectCustomClassEntries,
	cssPropertiesToDeclarations,
	resolveCustomClassName,
	resolveCustomClassOptions,
} from './custom-class-spec';

describe('resolveCustomClassOptions', () => {
	it('defaults to withPrefix true and prefix tb', () => {
		expect(resolveCustomClassOptions(undefined)).toEqual({
			withPrefix: true,
			prefix: 'tb',
		});
	});

	it('respects overrides', () => {
		expect(
			resolveCustomClassOptions({
				withPrefix: false,
				prefix: 'app',
				card: { padding: '8px' },
			}),
		).toEqual({
			withPrefix: false,
			prefix: 'app',
		});
	});
});

describe('resolveCustomClassName', () => {
	it('prefixes by default', () => {
		expect(resolveCustomClassName('card', { withPrefix: true, prefix: 'tb' })).toBe('tb-card');
	});

	it('returns bare name when withPrefix is false', () => {
		expect(resolveCustomClassName('card', { withPrefix: false, prefix: 'tb' })).toBe('card');
	});

	it('uses custom prefix', () => {
		expect(resolveCustomClassName('card', { withPrefix: true, prefix: 'app' })).toBe('app-card');
	});
});

describe('cssPropertiesToDeclarations', () => {
	it('converts camelCase keys to kebab-case', () => {
		expect(
			cssPropertiesToDeclarations({
				padding: '16px',
				backgroundColor: '#fff',
				borderTopLeftRadius: '4px',
			}),
		).toBe('padding:16px;background-color:#fff;border-top-left-radius:4px');
	});
});

describe('buildCustomClassRule', () => {
	it('emits a CSS rule', () => {
		expect(buildCustomClassRule('tb-card', { padding: '16px' })).toBe('.tb-card{padding:16px}');
	});
});

describe('collectCustomClassEntries', () => {
	it('skips meta keys', () => {
		const config = defineThemeConfig({
			classes: {
				withPrefix: false,
				prefix: 'app',
				card: { padding: '8px' },
			},
		});
		expect(collectCustomClassEntries(config)).toEqual([
			{ name: 'card', properties: { padding: '8px' } },
		]);
	});
});

describe('validateThemeConfig classes', () => {
	it('rejects invalid class names', () => {
		expect(() =>
			validateThemeConfig(
				defineThemeConfig({
					classes: {
						'2bad': { padding: '8px' },
					},
				}),
			),
		).toThrow(/invalid custom class name/);
	});

	it('rejects non-object class values', () => {
		expect(() =>
			validateThemeConfig(
				defineThemeConfig({
					classes: {
						card: 'bad' as unknown as { padding: string },
					},
				}),
			),
		).toThrow(/classes\.card must be an object/);
	});

	it('rejects invalid property values', () => {
		expect(() =>
			validateThemeConfig(
				defineThemeConfig({
					classes: {
						card: { padding: true as unknown as string },
					},
				}),
			),
		).toThrow(/classes\.card values must be string or number/);
	});
});
