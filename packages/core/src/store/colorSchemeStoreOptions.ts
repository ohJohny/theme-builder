import type { ColorSchemeId, ColorSchemePreference, ThemeMetaItem, ThemeStorageConfig } from '../colorScheme.types';

export type ColorSchemeListItem = ThemeMetaItem & {
	readonly active: boolean;
};

export type ColorSchemeStoreState = {
	/** User preference — may be `system`. */
	readonly colorScheme: ColorSchemePreference;
	/** Scheme applied to `data-theme`. */
	readonly resolvedColorScheme: ColorSchemeId;
	readonly colorSchemeList: readonly ColorSchemeListItem[];
	readonly labelShort: string;
};

export type ColorSchemeStoreOptions = {
	readonly schemes: readonly string[];
	readonly themeMeta?: readonly ThemeMetaItem[];
	readonly presetColorScheme?: ColorSchemePreference;
	readonly storage?: ThemeStorageConfig;
	readonly applyColorSchemeOnMount?: boolean;
	readonly additionalVariables?: Record<string, string>;
	/** When true (default), `system` is a valid preference and included in round-robin cycling. */
	readonly includeSystemScheme?: boolean;
	/** When true, scheme changes use `startColorSchemeViewTransition` (respects reduced motion). */
	readonly viewTransition?: boolean;
};
