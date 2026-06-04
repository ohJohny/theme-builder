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

	it('preserves prior CSS variables and stylesheet rules on incremental apply', () => {
		RawThemeBuilder.getInstance().apply(
			{ colors: { 'keep-me': '#111111' }, spacing: { lg: '24px' } },
			undefined,
			{ extendSingleton: false },
		);
		RawThemeBuilder.getInstance().apply(
			{ colors: { 'add-me': '#222222' } },
			undefined,
			{ extendSingleton: false },
		);

		expect(document.documentElement.style.getPropertyValue('--color-keep-me')).toBe(
			'#111111',
		);
		expect(document.documentElement.style.getPropertyValue('--space-lg')).toBe('24px');
		expect(document.documentElement.style.getPropertyValue('--color-add-me')).toBe(
			'#222222',
		);

		const style = document.querySelector('style[id^="c0-raw-theme"]');
		expect(style?.textContent).toContain('.bg-keep-me');
		expect(style?.textContent).toContain('.p-lg');
		expect(style?.textContent).toContain('.color-add-me');
	});

	it('skips inline color variables when inlineVariables is false but applies spacing', () => {
		document.documentElement.setAttribute('data-theme', 'dark');
		document.documentElement.style.setProperty('--color-scheme-token', '#abcdef');

		RawThemeBuilder.getInstance().apply(
			{ colors: { 'scheme-token': '#111111' }, spacing: { lg: '24px' } },
			undefined,
			{ extendSingleton: false, inlineVariables: false },
		);

		expect(document.documentElement.style.getPropertyValue('--color-scheme-token')).toBe(
			'#abcdef',
		);
		expect(document.documentElement.style.getPropertyValue('--space-lg')).toBe('24px');

		const style = document.querySelector('style[id^="c0-raw-theme"]');
		expect(style?.textContent).toContain('.bg-scheme-token{background-color:var(--color-scheme-token)}');
	});

	it('preserves non-color inline variables when extending with colors only', () => {
		RawThemeBuilder.getInstance().apply(
			{ spacing: { sm: '8px' } },
			undefined,
			{ extendSingleton: false, inlineVariables: false },
		);
		RawThemeBuilder.getInstance().apply({ colors: { brand: '#aabbcc' } });

		expect(document.documentElement.style.getPropertyValue('--space-sm')).toBe('8px');
		expect(document.documentElement.style.getPropertyValue('--color-brand')).toBe('#aabbcc');

		const style = document.querySelector('style[id^="c0-raw-theme"]');
		expect(style?.textContent).toContain('.m-sm{margin:var(--space-sm)}');
		expect(style?.textContent).toContain('.p-sm{');
	});

	it('playground flow: demo spacing vars survive color-only extend', () => {
		const spacing = { sm: '8px', md: '16px' };
		RawThemeBuilder.getInstance().apply(
			{ colors: { 'text-primary': '#111' }, spacing, gap: spacing },
			undefined,
			{ extendSingleton: false, inlineVariables: false },
		);
		RawThemeBuilder.getInstance().apply(
			{ colors: { 'custom-brand': '#7c3aed' } },
			undefined,
			{ extendSingleton: true },
		);

		expect(document.documentElement.style.getPropertyValue('--color-text-primary')).toBe('');
		expect(document.documentElement.style.getPropertyValue('--space-sm')).toBe('8px');
		expect(document.documentElement.style.getPropertyValue('--color-custom-brand')).toBe(
			'#7c3aed',
		);

		const style = document.querySelector('style[id^="c0-raw-theme"]');
		expect(style?.textContent).toContain('.m-md{margin:var(--space-md)}');
		expect(style?.textContent).toContain('.p-md{');
	});
});
