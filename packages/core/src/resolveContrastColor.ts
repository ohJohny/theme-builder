import type { Theme } from './types/theme.js';

import { resolvePaletteColor } from './resolvePaletteColor';

function contrastMix(bg: string, useLightForeground: boolean): string {
	return useLightForeground
		? `color-mix(in oklch, ${bg}, white 82%)`
		: `color-mix(in oklch, ${bg}, black 78%)`;
}

function parseHexRgb(hex: string): [number, number, number] | null {
	const normalized = hex.trim().replace(/^#/, '');
	if (/^[0-9a-f]{3}$/i.test(normalized)) {
		const r = parseInt(normalized[0]! + normalized[0]!, 16);
		const g = parseInt(normalized[1]! + normalized[1]!, 16);
		const b = parseInt(normalized[2]! + normalized[2]!, 16);
		return [r, g, b];
	}
	if (/^[0-9a-f]{6}$/i.test(normalized)) {
		const r = parseInt(normalized.slice(0, 2), 16);
		const g = parseInt(normalized.slice(2, 4), 16);
		const b = parseInt(normalized.slice(4, 6), 16);
		return [r, g, b];
	}
	return null;
}

function parseRgbString(color: string): [number, number, number] | null {
	const match = color.match(
		/^rgba?\(\s*([\d.]+)(?:%)?\s*,\s*([\d.]+)(?:%)?\s*,\s*([\d.]+)(?:%)?/i,
	);
	if (!match) return null;
	const toByte = (v: string, isPercent: boolean) => {
		const n = Number(v);
		if (isPercent) return Math.round((n / 100) * 255);
		return n <= 1 ? Math.round(n * 255) : Math.round(n);
	};
	const isPercent = color.includes('%');
	return [
		toByte(match[1]!, isPercent),
		toByte(match[2]!, isPercent),
		toByte(match[3]!, isPercent),
	];
}

function relativeLuminance(r: number, g: number, b: number): number {
	const channel = (c: number) => {
		const s = c / 255;
		return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function luminanceFromCssColor(color: string): number | null {
	const hex = parseHexRgb(color);
	if (hex) return relativeLuminance(...hex);
	const rgb = parseRgbString(color);
	if (rgb) return relativeLuminance(...rgb);
	return null;
}

/** Picks a readable foreground `color-mix` for text/icons on `bgInput`. */
export function resolveContrastColor(
	theme: Theme,
	bgInput: string,
	resolvedBg?: string,
): string {
	const bg = resolvedBg ?? resolvePaletteColor(theme, bgInput);

	const dash = bgInput.indexOf('-');
	if (dash > 0) {
		const weight = Number(bgInput.slice(dash + 1));
		if (Number.isInteger(weight) && weight >= 0 && weight <= 900) {
			return contrastMix(bg, weight >= 500);
		}
	}

	const luminance = luminanceFromCssColor(bg);
	if (luminance !== null) {
		return contrastMix(bg, luminance < 0.5);
	}

	const lightForeground = prefersLightForegroundFromToken(bgInput);
	if (lightForeground !== null) {
		return contrastMix(bg, lightForeground);
	}

	return contrastMix(bg, false);
}

function prefersLightForegroundFromToken(bgInput: string): boolean | null {
	if (/-(?:active|hover|pressed|default)(?:$|-)/.test(bgInput)) {
		return true;
	}
	if (/-(?:disabled|subtle|muted|surface|container|background)(?:$|-)/.test(bgInput)) {
		return false;
	}
	return null;
}
