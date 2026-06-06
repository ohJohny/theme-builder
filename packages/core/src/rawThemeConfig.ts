export type RawThemeFontsConfig = {
	readonly size?: Readonly<Record<string, string>>;
	readonly weight?: Readonly<Record<string, string>>;
	readonly lineHeight?: Readonly<Record<string, string>>;
	readonly family?: Readonly<Record<string, string>>;
};

import { isPlainObject } from './utils/isPlainObject';

export type RawThemeConfig = {
	readonly colors?: Readonly<Record<string, string>>;
	readonly spacing?: Readonly<Record<string, string>>;
	readonly gap?: Readonly<Record<string, string>>;
	readonly fonts?: RawThemeFontsConfig;
	readonly shadow?: Readonly<Record<string, string>>;
	readonly icon?: Readonly<Record<string, string>>;
	/** Keys are utility names (`flex`, `grid`, …); values are CSS `display` keywords. */
	readonly display?: Readonly<Record<string, string>>;
};

function isStringRecord(value: unknown): value is Record<string, string> {
	if (!isPlainObject(value)) return false;
	return Object.values(value).every((entry) => typeof entry === 'string');
}

function isRawThemeFontsConfig(value: unknown): value is RawThemeFontsConfig {
	if (!isPlainObject(value)) return false;
	if (value.size !== undefined && !isStringRecord(value.size)) return false;
	if (value.weight !== undefined && !isStringRecord(value.weight)) return false;
	if (value.lineHeight !== undefined && !isStringRecord(value.lineHeight)) return false;
	if (value.family !== undefined && !isStringRecord(value.family)) return false;
	return true;
}

export function isRawThemeConfig(value: unknown): value is RawThemeConfig {
	if (!isPlainObject(value)) return false;
	if (value.colors !== undefined && !isStringRecord(value.colors)) return false;
	if (value.spacing !== undefined && !isStringRecord(value.spacing)) return false;
	if (value.gap !== undefined && !isStringRecord(value.gap)) return false;
	if (value.fonts !== undefined && !isRawThemeFontsConfig(value.fonts)) return false;
	if (value.shadow !== undefined && !isStringRecord(value.shadow)) return false;
	if (value.icon !== undefined && !isStringRecord(value.icon)) return false;
	if (value.display !== undefined && !isStringRecord(value.display)) return false;
	return true;
}

export function parseRawThemeConfig(input: RawThemeConfig | string): RawThemeConfig {
	if (typeof input !== 'string') return input;

	let parsed: unknown;
	try {
		parsed = JSON.parse(input) as unknown;
	} catch {
		throw new SyntaxError('[RawThemeBuilder] config string is not valid JSON');
	}

	if (!isRawThemeConfig(parsed)) {
		throw new TypeError('[RawThemeBuilder] config JSON does not match RawThemeConfig shape');
	}

	return parsed;
}
