/** True when resolved palette color is a flat fill (not gradient or image). */
export function isSolidPaintCssValue(resolved: string): boolean {
	return !/gradient\s*\(/i.test(resolved) && !/\burl\s*\(/i.test(resolved);
}
