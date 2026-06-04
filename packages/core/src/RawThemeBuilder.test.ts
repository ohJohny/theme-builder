// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';

import { ThemeBuilder } from './ThemeBuilder';
import { RawThemeBuilder } from './RawThemeBuilder';
import { resolvePaletteColor } from './resolvePaletteColor';

describe('RawThemeBuilder', () => {
	afterEach(() => {
		RawThemeBuilder.getInstance().dispose();
	});

	it('sets CSS variables on documentElement and extends singleton theme', () => {
		RawThemeBuilder.getInstance().apply({
			colors: {
				'raw-brand': '#112233',
			},
		});

		expect(document.documentElement.style.getPropertyValue('--color-raw-brand')).toBe(
			'#112233',
		);

		const theme = ThemeBuilder.getInstance().getTheme();
		expect(theme.colors['raw-brand']).toBe('var(--color-raw-brand)');
		expect(resolvePaletteColor(theme, 'raw-brand')).toBe('var(--color-raw-brand)');
	});

	it('injects utility stylesheet for color tokens', () => {
		RawThemeBuilder.getInstance().apply({ colors: { accent: '#00ff00' } });

		const style = document.querySelector('style[id^="c0-raw-theme"]');
		expect(style?.textContent).toContain('.color-accent{color:var(--color-accent)}');
		expect(style?.textContent).toContain('.bg-accent{background-color:var(--color-accent)}');
	});

	it('applies variables on a custom HTMLElement target', () => {
		const host = document.createElement('motion-div');
		document.body.appendChild(host);

		RawThemeBuilder.getInstance().apply(
			{ spacing: { hero: '64px' } },
			host,
			{ extendSingleton: false },
		);

		expect(host.style.getPropertyValue('--space-hero')).toBe('64px');

		RawThemeBuilder.getInstance().dispose(host);
		host.remove();
	});

	it('parses JSON string config', () => {
		const extension = RawThemeBuilder.getInstance().toThemeExtension(
			JSON.stringify({ colors: { json: '#abc' } }),
		);
		expect(extension.colors?.json).toBe('var(--color-json)');
	});
});
