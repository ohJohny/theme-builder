export type ColorSchemeId = string;

/** Reserved preference id — follows OS `prefers-color-scheme`. */
export const SYSTEM_COLOR_SCHEME = 'system' as const;

export type ColorSchemePreference = ColorSchemeId | typeof SYSTEM_COLOR_SCHEME;

export const SYSTEM_THEME_META: ThemeMetaItem = {
	id: SYSTEM_COLOR_SCHEME,
	label: 'System',
	labelShort: 'Sys',
};

export type ThemeOption = {
	readonly id: string;
	readonly label: string;
};

export type ThemeMetaItem = {
	readonly id: string;
	readonly label: string;
	readonly labelShort: string;
};

export type ThemeStorageConfig = {
	readonly type: 'localStorage' | 'cookie';
	readonly key: string;
};

export const DEFAULT_SCHEMES: readonly string[] = ['light', 'dark'];

export const DEFAULT_THEME_META: readonly ThemeMetaItem[] = [
	{ id: 'light', label: 'Light', labelShort: 'Lt' },
	{ id: 'dark', label: 'Dark', labelShort: 'Dk' },
];

export function isKnownScheme(value: string, schemes: readonly string[]): boolean {
	return schemes.includes(value);
}

export function isColorSchemePreference(
	value: string,
	schemes: readonly string[],
	includeSystemScheme = true,
): value is ColorSchemePreference {
	if (includeSystemScheme && value === SYSTEM_COLOR_SCHEME) {
		return true;
	}
	return isKnownScheme(value, schemes);
}

/** @deprecated Use isColorSchemePreference or isKnownScheme with explicit schemes */
export function isColorSchemeId(value: string): value is ColorSchemeId {
	return value === 'light' || value === 'dark';
}

export function deriveThemeMeta(schemes: readonly string[]): readonly ThemeMetaItem[] {
	return schemes.map((id) => ({
		id,
		label: id.charAt(0).toUpperCase() + id.slice(1),
		labelShort: id.slice(0, 2),
	}));
}
