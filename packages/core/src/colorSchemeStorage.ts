import type { ColorSchemeId, ThemeStorageConfig } from './colorScheme.types';
import { isColorSchemeId } from './colorScheme.types';

/** Shared key for Storybook toolbar + `StoryThemeProvider`. */
export const STORY_COLOR_SCHEME_STORAGE_KEY = 'story-theme';

export function readStoredColorScheme(config: ThemeStorageConfig): ColorSchemeId | null {
	if (typeof window === 'undefined') return null;

	let raw: string | null;
	if (config.type === 'localStorage') {
		raw = window.localStorage.getItem(config.key);
	} else {
		const match = document.cookie.match(
			new RegExp(`(?:^|; )${escapeCookieName(config.key)}=([^;]*)`),
		);
		raw = match ? decodeURIComponent(match[1]) : null;
	}

	return raw && isColorSchemeId(raw) ? raw : null;
}

export function writeStoredColorScheme(
	config: ThemeStorageConfig,
	colorScheme: ColorSchemeId,
): void {
	if (typeof window === 'undefined') return;

	if (config.type === 'localStorage') {
		window.localStorage.setItem(config.key, colorScheme);
		return;
	}

	document.cookie = `${config.key}=${encodeURIComponent(colorScheme)}; path=/; max-age=31536000; SameSite=Lax`;
}

/** Persists to both localStorage and a cookie (same key) for Storybook / app parity. */
export function writePersistedColorScheme(
	key: string,
	colorScheme: ColorSchemeId,
): void {
	writeStoredColorScheme({ type: 'localStorage', key }, colorScheme);
	writeStoredColorScheme({ type: 'cookie', key }, colorScheme);
}

export function clearPersistedColorScheme(key: string): void {
	if (typeof window === 'undefined') return;

	window.localStorage.removeItem(key);
	document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax`;
}

function escapeCookieName(name: string): string {
	return name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
