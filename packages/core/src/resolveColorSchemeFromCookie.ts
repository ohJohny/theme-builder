import type { ColorSchemeId } from './colorScheme.types';
import { parseCookieValue } from './parseCookieValue';
import { resolveInitialAppliedColorScheme } from './resolveInitialColorScheme';

export type ResolveColorSchemeFromCookieOptions = {
	readonly schemes: readonly string[];
	readonly preset: ColorSchemeId;
	readonly storageKey: string;
	readonly includeSystemScheme?: boolean;
};

/** Server-safe: resolve the applied color scheme from a request `Cookie` header. */
export function resolveColorSchemeFromCookie(
	cookieHeader: string | undefined,
	options: ResolveColorSchemeFromCookieOptions,
): ColorSchemeId {
	const stored =
		cookieHeader !== undefined ? parseCookieValue(cookieHeader, options.storageKey) : null;
	return resolveInitialAppliedColorScheme({
		schemes: options.schemes,
		preset: options.preset,
		stored,
		includeSystemScheme: options.includeSystemScheme,
	});
}
