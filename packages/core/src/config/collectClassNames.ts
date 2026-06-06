import { buildUtilityClassMap } from '../utils/utility-class-map';
import {
	colorUtilityClasses,
	displayUtilityClass,
	fontFamilyUtilityClass,
	fontSizeUtilityClass,
	fontWeightUtilityClass,
	gapUtilityClass,
	iconUtilityClass,
	lineHeightUtilityClass,
	shadowUtilityClass,
	spacingUtilityClass,
} from '../utils/theme-token-spec';
import { SPACING_PREFIXES } from '../types/theme.js';
import type { ThemeConfigInput } from './types';

export function collectClassNames(config: ThemeConfigInput): readonly string[] {
	const names = new Set<string>();

	if (config.colors?.base) {
		for (const name of Object.keys(config.colors.base)) {
			const { foreground, background } = colorUtilityClasses(name);
			names.add(foreground);
			names.add(background);
		}
	}

	if (config.colors?.semantic) {
		for (const name of Object.keys(config.colors.semantic)) {
			const { foreground, background } = colorUtilityClasses(name);
			names.add(foreground);
			names.add(background);
		}
	}

	if (config.spacing) {
		for (const name of Object.keys(config.spacing)) {
			for (const prefix of SPACING_PREFIXES) {
				names.add(spacingUtilityClass(prefix, name));
			}
			names.add(gapUtilityClass(name));
		}
	}

	if (config.fonts?.family) {
		for (const name of Object.keys(config.fonts.family)) {
			names.add(fontFamilyUtilityClass(name));
		}
	}

	if (config.fonts?.size) {
		for (const name of Object.keys(config.fonts.size)) {
			names.add(fontSizeUtilityClass(name));
		}
	}

	if (config.fonts?.weight) {
		for (const name of Object.keys(config.fonts.weight)) {
			names.add(fontWeightUtilityClass(name));
		}
	}

	if (config.fonts?.lineHeight) {
		for (const name of Object.keys(config.fonts.lineHeight)) {
			names.add(lineHeightUtilityClass(name));
		}
	}

	if (config.shadow) {
		for (const name of Object.keys(config.shadow)) {
			names.add(shadowUtilityClass(name));
		}
	}

	if (config.icon) {
		for (const name of Object.keys(config.icon)) {
			names.add(iconUtilityClass(name));
		}
	}

	if (config.display) {
		for (const name of Object.keys(config.display)) {
			names.add(displayUtilityClass(name));
		}
	}

	return [...names].sort();
}

export function buildThemeClassMap(
	config: ThemeConfigInput,
	mode: 'identity' | 'hashed',
	utilityClassHashSalt?: string,
): Readonly<Record<string, string>> {
	const catalog = collectClassNames(config);
	return buildUtilityClassMap(mode, catalog, utilityClassHashSalt);
}
