import { describe, expect, it } from 'vitest';

import { buildBreakpointsScss } from './config/buildBreakpointsScss';
import { buildThemeStylesheet } from './config/buildThemeStylesheet';
import { createTheme } from './config/createTheme';
import { generateThemeArtifacts } from './config/generateThemeArtifacts';
import { createColorSchemeStore } from './store/createColorSchemeStore';
import { testThemeConfig } from './testFixtures';

describe('createTheme', () => {
	it('builds identity class names from config', () => {
		const created = createTheme(testThemeConfig, { mode: 'identity' });
		expect(created.theme.spacing.px.md.class).toBe('px-md');
		expect(created.theme.gap.sm.class).toBe('gap-sm');
		expect(created.theme.colorUtilities.semantic.tokens['text-primary'].foreground.class).toBe(
			'color-text-primary',
		);
	});

	it('builds hashed class names', () => {
		const created = createTheme(testThemeConfig, { mode: 'hashed' });
		expect(created.theme.spacing.px.md.class).toMatch(/^c0-/);
	});
});

describe('buildThemeStylesheet scheme blocks', () => {
	it('emits :root and per-scheme blocks for 3 schemes', () => {
		const config = {
			...testThemeConfig,
			schemes: ['light', 'dark', 'sepia'] as const,
			colors: {
				...testThemeConfig.colors,
				semantic: {
					'text-primary': { light: '#111', dark: '#eee', sepia: '#333' },
				},
			},
		};
		const css = buildThemeStylesheet(config, {
			defaultScheme: 'light',
			schemes: ['light', 'dark', 'sepia'],
		});
		expect(css).toContain(':root{');
		expect(css).toContain(':root,[data-theme="light"]');
		expect(css).toContain('[data-theme="dark"]');
		expect(css).toContain('[data-theme="sepia"]');
	});
});

describe('buildBreakpointsScss', () => {
	it('emits mixins for min/max/both', () => {
		const scss = buildBreakpointsScss({
			breakpoints: {
				mobile: { max: '767px' },
				tablet: { min: '768px', max: '1023px' },
				desktop: { min: '1024px' },
			},
		});
		expect(scss).toContain('@mixin mobile { @media (max-width: 767px) { @content; } }');
		expect(scss).toContain(
			'@mixin tablet { @media (min-width: 768px) and (max-width: 1023px) { @content; } }',
		);
		expect(scss).toContain('@mixin desktop { @media (min-width: 1024px) { @content; } }');
	});

	it('returns undefined when breakpoints absent', () => {
		expect(buildBreakpointsScss({})).toBeUndefined();
	});
});

describe('createColorSchemeStore round-robin', () => {
	it('cycles through N schemes', () => {
		const store = createColorSchemeStore({
			schemes: ['light', 'dark', 'sepia'],
			applyColorSchemeOnMount: false,
		});
		expect(store.getState().colorScheme).toBe('light');
		store.changeColorScheme();
		expect(store.getState().colorScheme).toBe('dark');
		store.changeColorScheme();
		expect(store.getState().colorScheme).toBe('sepia');
		store.changeColorScheme();
		expect(store.getState().colorScheme).toBe('light');
		store.dispose();
	});
});

describe('generateThemeArtifacts', () => {
	it('requires outDir', async () => {
		await expect(
			generateThemeArtifacts(testThemeConfig, { mode: 'identity', outDir: '' }),
		).rejects.toThrow(/outDir is required/);
	});
});
