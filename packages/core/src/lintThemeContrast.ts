import { isPlainObject } from './utils/isPlainObject';
import type { ThemeConfigInput } from './config/types';

export type ThemeContrastWarning = {
	readonly token: string;
	readonly scheme: string;
	readonly foreground: string;
	readonly background: string;
	readonly ratio: number;
};

function parseHexRgb(hex: string): [number, number, number] | null {
	const normalized = hex.trim().replace(/^#/, '');
	if (/^[0-9a-f]{3}$/i.test(normalized)) {
		const r = parseInt(normalized[0]! + normalized[0]!, 16);
		const g = parseInt(normalized[1]! + normalized[1]!, 16);
		const b = parseInt(normalized[2]! + normalized[2]!, 16);
		return [r, g, b];
	}
	if (/^[0-9a-f]{6}$/i.test(normalized)) {
		return [
			parseInt(normalized.slice(0, 2), 16),
			parseInt(normalized.slice(2, 4), 16),
			parseInt(normalized.slice(4, 6), 16),
		];
	}
	return null;
}

function relativeLuminance(r: number, g: number, b: number): number {
	const channel = (c: number) => {
		const s = c / 255;
		return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(foreground: string, background: string): number | null {
	const fg = parseHexRgb(foreground);
	const bg = parseHexRgb(background);
	if (!fg || !bg) return null;
	const l1 = relativeLuminance(...fg);
	const l2 = relativeLuminance(...bg);
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + 0.05) / (darker + 0.05);
}

const TEXT_TOKEN_PATTERN = /text/i;
const SURFACE_TOKEN_PATTERN = /surface|background|body/i;

/** Warn when semantic text/surface hex pairs fall below WCAG AA (4.5:1). */
export function lintThemeContrast(
	config: ThemeConfigInput,
	minRatio = 4.5,
): readonly ThemeContrastWarning[] {
	const schemes = config.schemes ?? ['light', 'dark'];
	const semantic = config.colors?.semantic;
	if (!semantic) return [];

	const textTokens = Object.entries(semantic).filter(([name]) => TEXT_TOKEN_PATTERN.test(name));
	const surfaceTokens = Object.entries(semantic).filter(([name]) =>
		SURFACE_TOKEN_PATTERN.test(name),
	);
	if (textTokens.length === 0 || surfaceTokens.length === 0) return [];

	const warnings: ThemeContrastWarning[] = [];

	for (const scheme of schemes) {
		const textEntry = textTokens.find(([, value]) =>
			isPlainObject(value) ? value[scheme] !== undefined : true,
		);
		const surfaceEntry = surfaceTokens.find(([, value]) =>
			isPlainObject(value) ? value[scheme] !== undefined : true,
		);
		if (!textEntry || !surfaceEntry) continue;

		const foreground =
			typeof textEntry[1] === 'string' ? textEntry[1] : textEntry[1][scheme] ?? '';
		const background =
			typeof surfaceEntry[1] === 'string' ? surfaceEntry[1] : surfaceEntry[1][scheme] ?? '';
		const ratio = contrastRatio(foreground, background);
		if (ratio !== null && ratio < minRatio) {
			warnings.push({
				token: `${textEntry[0]} on ${surfaceEntry[0]}`,
				scheme,
				foreground,
				background,
				ratio,
			});
		}
	}

	return warnings;
}
