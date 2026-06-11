import { describe, expect, it } from 'vitest';

import { buildBreakpointsScss } from './config/buildBreakpointsScss';
import { buildThemeStylesheet } from './config/buildThemeStylesheet';
import { createTheme } from './config/createTheme';
import { defineThemeConfig } from './config/defineThemeConfig';
import { generateThemeArtifacts } from './config/generateThemeArtifacts';
import { createColorSchemeStore } from './store/createColorSchemeStore';
import { rewriteUtilityCss } from './utils/utility-class-map';
import { buildThemeClassMap } from './config/collectClassNames';
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
		expect(created.theme.spacing.px.md.class).toMatch(/^cl-/);
	});

	it('injects hashed utility classes that match classMap', () => {
		const created = createTheme(testThemeConfig, { mode: 'hashed', inject: true });
		const injected = document.querySelector('style[id^="theme-builder-injected-"]');
		expect(injected?.textContent).toContain(created.theme.spacing.px.md.class);
		expect(injected?.textContent).not.toContain('.px-md{');
	});

	it('exposes custom classes on theme.classes', () => {
		const created = createTheme(testThemeConfig, { mode: 'identity' });
		expect(created.theme.classes.card.class).toBe('tb-card');
	});
});

describe('custom classes in stylesheet', () => {
	it('emits prefixed custom class rules', () => {
		const css = buildThemeStylesheet(testThemeConfig, {
			defaultScheme: 'light',
			schemes: ['light', 'dark'],
		});
		expect(css).toContain(
			'.tb-card{padding:var(--space-md);border-radius:8px;background-color:var(--color-surface-main)}',
		);
	});

	it('emits bare class names when withPrefix is false', () => {
		const config = defineThemeConfig({
			...testThemeConfig,
			classes: {
				withPrefix: false,
				card: { padding: '16px' },
			},
		});
		const css = buildThemeStylesheet(config, {
			defaultScheme: 'light',
			schemes: ['light', 'dark'],
		});
		expect(css).toContain('.card{padding:16px}');
		expect(css).not.toContain('.tb-card{padding:16px}');
	});

	it('leaves custom classes unhashed in hashed mode', () => {
		const classMap = buildThemeClassMap(testThemeConfig, 'hashed');
		let css = buildThemeStylesheet(testThemeConfig, {
			defaultScheme: 'light',
			schemes: ['light', 'dark'],
		});
		css = rewriteUtilityCss(css, classMap);
		expect(css).toContain(
			'.tb-card{padding:var(--space-md);border-radius:8px;background-color:var(--color-surface-main)}',
		);
	});
});

describe('buildThemeStylesheet scheme blocks', () => {
	it('emits --rem-base and sets root font-size from it', () => {
		const css = buildThemeStylesheet(testThemeConfig, {
			defaultScheme: 'light',
			schemes: ['light', 'dark'],
		});
		expect(css).toMatch(/:root\{[^}]*--rem-base:16px/);
		expect(css).toMatch(/:root\{[^}]*font-size:var\(--rem-base\)/);
	});

	it('defaults --rem-base to 16px when remBase is omitted', () => {
		const { remBase: _remBase, ...configWithoutRemBase } = testThemeConfig;
		const css = buildThemeStylesheet(configWithoutRemBase, {
			defaultScheme: 'light',
			schemes: ['light', 'dark'],
		});
		expect(css).toMatch(/:root\{[^}]*--rem-base:16px/);
		expect(css).toMatch(/:root\{[^}]*font-size:var\(--rem-base\)/);
	});

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
				mobile: { max: '47.9375rem' },
				tablet: { min: '48rem', max: '63.9375rem' },
				desktop: { min: '64rem' },
			},
		});
		expect(scss).toContain('@mixin mobile { @media (max-width: 47.9375rem) { @content; } }');
		expect(scss).toContain(
			'@mixin tablet { @media (min-width: 48rem) and (max-width: 63.9375rem) { @content; } }',
		);
		expect(scss).toContain('@mixin desktop { @media (min-width: 64rem) { @content; } }');
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
			includeSystemScheme: false,
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
