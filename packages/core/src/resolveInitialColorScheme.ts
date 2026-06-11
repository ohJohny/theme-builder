import {
	DEFAULT_SCHEMES,
	isColorSchemePreference,
	type ColorSchemePreference,
} from './colorScheme.types';
import { resolveAppliedColorScheme } from './resolveAppliedColorScheme';

export type ResolveInitialColorSchemeOptions = {
	readonly schemes: readonly string[];
	readonly preset: ColorSchemePreference;
	readonly stored: string | null;
	readonly includeSystemScheme?: boolean;
};

/** Resolves the stored/user preference (may be `system`). */
export function resolveColorSchemePreference(
	options: ResolveInitialColorSchemeOptions,
): ColorSchemePreference {
	const { schemes, preset, stored, includeSystemScheme = true } = options;
	if (stored && isColorSchemePreference(stored, schemes, includeSystemScheme)) {
		return stored;
	}
	if (isColorSchemePreference(preset, schemes, includeSystemScheme)) {
		return preset;
	}
	return schemes[0] ?? DEFAULT_SCHEMES[0];
}

/** Shared logic for store mount, blocking init script, and SSR cookie resolution. */
export function resolveInitialColorScheme(
	options: ResolveInitialColorSchemeOptions,
): ColorSchemePreference {
	return resolveColorSchemePreference(options);
}

/** Resolves the scheme value applied to `data-theme`. */
export function resolveInitialAppliedColorScheme(
	options: ResolveInitialColorSchemeOptions,
): string {
	const preference = resolveColorSchemePreference(options);
	return resolveAppliedColorScheme(preference, options.schemes);
}
