import {
	DEFAULT_SCHEMES,
	SYSTEM_COLOR_SCHEME,
	isKnownScheme,
	type ColorSchemeId,
	type ColorSchemePreference,
} from './colorScheme.types';

const PREFERS_DARK_QUERY = '(prefers-color-scheme: dark)';

/** Read OS dark-mode preference (client-only; returns false when `window` is unavailable). */
export function getSystemPrefersDark(): boolean {
	if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
		return false;
	}
	return window.matchMedia(PREFERS_DARK_QUERY).matches;
}

/** Map a stored preference (including `system`) to the scheme applied on `data-theme`. */
export function resolveAppliedColorScheme(
	preference: ColorSchemePreference,
	schemes: readonly string[],
	prefersDark: boolean = getSystemPrefersDark(),
): ColorSchemeId {
	if (preference !== SYSTEM_COLOR_SCHEME) {
		return preference;
	}

	const hasDark = schemes.includes('dark');
	const hasLight = schemes.includes('light');

	if (prefersDark && hasDark) {
		return 'dark';
	}
	if (!prefersDark && hasLight) {
		return 'light';
	}

	return schemes[0] ?? DEFAULT_SCHEMES[0];
}

export function preferenceCycle(
	schemes: readonly string[],
	includeSystemScheme: boolean,
): readonly ColorSchemePreference[] {
	if (!includeSystemScheme) {
		return schemes;
	}
	return [...schemes, SYSTEM_COLOR_SCHEME];
}

export function nextPreferenceInCycle(
	schemes: readonly string[],
	current: ColorSchemePreference,
	includeSystemScheme: boolean,
): ColorSchemePreference {
	const cycle = preferenceCycle(schemes, includeSystemScheme);
	const index = cycle.indexOf(current);
	if (index === -1 || cycle.length === 0) {
		return cycle[0] ?? schemes[0] ?? DEFAULT_SCHEMES[0];
	}
	return cycle[(index + 1) % cycle.length] ?? current;
}

export function isValidStoredPreference(
	value: string,
	schemes: readonly string[],
	includeSystemScheme: boolean,
): value is ColorSchemePreference {
	if (includeSystemScheme && value === SYSTEM_COLOR_SCHEME) {
		return true;
	}
	return isKnownScheme(value, schemes);
}
