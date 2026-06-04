export type ColorSchemeId = 'light' | 'dark';

export const COLOR_SCHEME_IDS: readonly ColorSchemeId[] = ['light', 'dark'];

export type ThemeOption = {
	readonly id: string;
	readonly label: string;
};

export type ThemeMetaItem = {
	readonly id: ColorSchemeId;
	readonly label: string;
	readonly labelShort: string;
};

export type ThemeStorageConfig = {
	readonly type: 'localStorage' | 'cookie';
	readonly key: string;
};

export const DEFAULT_THEME_META: readonly ThemeMetaItem[] = [
	{ id: 'light', label: 'Light', labelShort: 'Lt' },
	{ id: 'dark', label: 'Dark', labelShort: 'Dk' },
];

export function isColorSchemeId(value: string): value is ColorSchemeId {
	return value === 'light' || value === 'dark';
}
