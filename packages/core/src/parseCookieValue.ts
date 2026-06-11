/** Escape a cookie name for use in a RegExp (server-safe). */
export function escapeCookieName(name: string): string {
	return name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Parse a single cookie value from a `Cookie` header or `document.cookie` string. */
export function parseCookieValue(cookieHeader: string, key: string): string | null {
	const match = cookieHeader.match(new RegExp(`(?:^|; )${escapeCookieName(key)}=([^;]*)`));
	if (!match) return null;
	try {
		return decodeURIComponent(match[1]);
	} catch {
		return match[1];
	}
}
