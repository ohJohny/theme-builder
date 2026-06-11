import type { ColorSchemeId, ColorSchemePreference, ThemeStorageConfig } from './colorScheme.types';
import { isColorSchemePreference } from './colorScheme.types';
import { parseCookieValue } from './parseCookieValue';

/** Shared key for Storybook toolbar + `StoryThemeProvider`. */
export const STORY_COLOR_SCHEME_STORAGE_KEY = 'story-theme';

type StorageAdapter = {
	readonly read: (key: string) => string | null;
	readonly write: (key: string, value: string) => void;
	readonly remove: (key: string) => void;
};

const localStorageAdapter: StorageAdapter = {
	read(key) {
		return window.localStorage.getItem(key);
	},
	write(key, value) {
		window.localStorage.setItem(key, value);
	},
	remove(key) {
		window.localStorage.removeItem(key);
	},
};

const cookieAdapter: StorageAdapter = {
	read(key) {
		return parseCookieValue(document.cookie, key);
	},
	write(key, value) {
		document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
	},
	remove(key) {
		document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax`;
	},
};

const STORAGE_ADAPTERS: Record<ThemeStorageConfig['type'], StorageAdapter> = {
	localStorage: localStorageAdapter,
	cookie: cookieAdapter,
};

function getAdapter(type: ThemeStorageConfig['type']): StorageAdapter {
	return STORAGE_ADAPTERS[type];
}

export function readRawStorageValue(config: ThemeStorageConfig): string | null {
	if (typeof window === 'undefined') return null;
	return getAdapter(config.type).read(config.key);
}

export function readStoredColorScheme(
	config: ThemeStorageConfig,
	schemes: readonly string[],
	includeSystemScheme = true,
): ColorSchemePreference | null {
	const raw = readRawStorageValue(config);
	return raw && isColorSchemePreference(raw, schemes, includeSystemScheme) ? raw : null;
}

export function writeStoredColorScheme(
	config: ThemeStorageConfig,
	colorScheme: ColorSchemePreference,
): void {
	if (typeof window === 'undefined') return;

	getAdapter(config.type).write(config.key, colorScheme);
}

/** Persists to both localStorage and a cookie (same key) for Storybook / app parity. */
export function writePersistedColorScheme(
	key: string,
	colorScheme: ColorSchemePreference,
): void {
	writeStoredColorScheme({ type: 'localStorage', key }, colorScheme);
	writeStoredColorScheme({ type: 'cookie', key }, colorScheme);
}

export function clearPersistedColorScheme(key: string): void {
	if (typeof window === 'undefined') return;

	localStorageAdapter.remove(key);
	cookieAdapter.remove(key);
}
