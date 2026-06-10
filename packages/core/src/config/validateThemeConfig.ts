import {
	isCustomClassMetaKey,
	isValidCustomClassName,
} from '../utils/custom-class-spec';
import { isPlainObject } from '../utils/isPlainObject';
import { isRemLength } from '../utils/remLength.js';
import type { BreakpointValue, ThemeConfigInput } from './types';

function isStringRecord(value: unknown): value is Record<string, string> {
	if (!isPlainObject(value)) return false;
	return Object.values(value).every((entry) => typeof entry === 'string');
}

function isColorValue(value: unknown): boolean {
	if (typeof value === 'string') return true;
	if (!isPlainObject(value)) return false;
	return Object.values(value).every((entry) => typeof entry === 'string');
}

function isBreakpointValue(value: unknown): value is BreakpointValue {
	if (!isPlainObject(value)) return false;
	const min = value.min;
	const max = value.max;
	if (min !== undefined && !isRemLength(min)) return false;
	if (max !== undefined && !isRemLength(max)) return false;
	if (min === undefined && max === undefined) return false;
	return true;
}

export function validateThemeConfig(config: ThemeConfigInput): void {
	if (config.schemes !== undefined) {
		if (!Array.isArray(config.schemes) || config.schemes.length === 0) {
			throw new TypeError('[defineThemeConfig] schemes must be a non-empty readonly array');
		}
		for (const scheme of config.schemes) {
			if (typeof scheme !== 'string' || scheme.length === 0) {
				throw new TypeError('[defineThemeConfig] each scheme must be a non-empty string');
			}
		}
	}

	if (config.colors !== undefined) {
		if (!isPlainObject(config.colors)) {
			throw new TypeError('[defineThemeConfig] colors must be an object');
		}
		if (config.colors.base !== undefined && !isStringRecord(config.colors.base)) {
			throw new TypeError('[defineThemeConfig] colors.base must be Record<string, string>');
		}
		if (config.colors.semantic !== undefined) {
			if (!isPlainObject(config.colors.semantic)) {
				throw new TypeError('[defineThemeConfig] colors.semantic must be an object');
			}
			for (const value of Object.values(config.colors.semantic)) {
				if (!isColorValue(value)) {
					throw new TypeError('[defineThemeConfig] invalid semantic color value');
				}
			}
		}
	}

	if (config.remBase !== undefined && typeof config.remBase !== 'string') {
		throw new TypeError('[defineThemeConfig] remBase must be a string');
	}

	if (config.spacing !== undefined && !isStringRecord(config.spacing)) {
		throw new TypeError('[defineThemeConfig] spacing must be Record<string, string>');
	}
	if ('gap' in config && config.gap !== undefined) {
		throw new TypeError(
			'[defineThemeConfig] gap is no longer a separate config key — define tokens under spacing instead',
		);
	}
	if (config.shadow !== undefined && !isStringRecord(config.shadow)) {
		throw new TypeError('[defineThemeConfig] shadow must be Record<string, string>');
	}
	if (config.icon !== undefined && !isStringRecord(config.icon)) {
		throw new TypeError('[defineThemeConfig] icon must be Record<string, string>');
	}
	if (config.display !== undefined && !isStringRecord(config.display)) {
		throw new TypeError('[defineThemeConfig] display must be Record<string, string>');
	}

	if (config.fonts !== undefined) {
		if (!isPlainObject(config.fonts)) {
			throw new TypeError('[defineThemeConfig] fonts must be an object');
		}
		const { family, size, weight, lineHeight } = config.fonts;
		if (family !== undefined && !isStringRecord(family)) {
			throw new TypeError('[defineThemeConfig] fonts.family must be Record<string, string>');
		}
		if (size !== undefined && !isStringRecord(size)) {
			throw new TypeError('[defineThemeConfig] fonts.size must be Record<string, string>');
		}
		if (weight !== undefined && !isStringRecord(weight)) {
			throw new TypeError('[defineThemeConfig] fonts.weight must be Record<string, string>');
		}
		if (lineHeight !== undefined && !isStringRecord(lineHeight)) {
			throw new TypeError('[defineThemeConfig] fonts.lineHeight must be Record<string, string>');
		}
	}

	if (config.breakpoints !== undefined) {
		if (!isPlainObject(config.breakpoints)) {
			throw new TypeError('[defineThemeConfig] breakpoints must be an object');
		}
		for (const value of Object.values(config.breakpoints)) {
			if (!isBreakpointValue(value)) {
				throw new TypeError('[defineThemeConfig] invalid breakpoint value');
			}
		}
	}

	if (config.classes !== undefined) {
		if (!isPlainObject(config.classes)) {
			throw new TypeError('[defineThemeConfig] classes must be an object');
		}
		if (
			config.classes.withPrefix !== undefined &&
			typeof config.classes.withPrefix !== 'boolean'
		) {
			throw new TypeError('[defineThemeConfig] classes.withPrefix must be a boolean');
		}
		if (config.classes.prefix !== undefined) {
			if (typeof config.classes.prefix !== 'string' || config.classes.prefix.length === 0) {
				throw new TypeError('[defineThemeConfig] classes.prefix must be a non-empty string');
			}
		}
		for (const [name, value] of Object.entries(config.classes)) {
			if (isCustomClassMetaKey(name)) continue;
			if (!isValidCustomClassName(name)) {
				throw new TypeError(`[defineThemeConfig] invalid custom class name "${name}"`);
			}
			if (!isPlainObject(value)) {
				throw new TypeError(`[defineThemeConfig] classes.${name} must be an object`);
			}
			for (const propValue of Object.values(value)) {
				if (typeof propValue !== 'string' && typeof propValue !== 'number') {
					throw new TypeError(
						`[defineThemeConfig] classes.${name} values must be string or number`,
					);
				}
			}
		}
	}
}
