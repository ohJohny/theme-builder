/** CSS rem length. Bare numbers mean rem. */
export type RemLength = number | string;

const REM_PATTERN = /^(-?\d+(?:\.\d+)?)rem$/i;
const BARE_NUMBER_PATTERN = /^-?\d+(?:\.\d+)?$/;
const PX_PATTERN = /px$/i;

/** Parses a rem length to its numeric rem value. */
export function parseRemValue(value: RemLength): number {
	if (typeof value === 'number') {
		return value;
	}

	const trimmed = value.trim();
	const remMatch = trimmed.match(REM_PATTERN);
	if (remMatch) {
		return Number(remMatch[1]);
	}

	if (BARE_NUMBER_PATTERN.test(trimmed)) {
		return Number(trimmed);
	}

	throw new RangeError(`[remLength] expected rem length, got "${value}"`);
}

/** Converts rem to pixels using the root font size. */
export function remLengthToPx(value: RemLength, rootFontPx: number): number {
	return parseRemValue(value) * rootFontPx;
}

/** Formats a rem length for CSS media queries and other stylesheet output. */
export function formatRemCss(value: RemLength): string {
	return `${parseRemValue(value)}rem`;
}

export function isRemLength(value: unknown): value is RemLength {
	if (typeof value === 'number') {
		return Number.isFinite(value);
	}
	if (typeof value !== 'string') {
		return false;
	}

	const trimmed = value.trim();
	if (PX_PATTERN.test(trimmed)) {
		return false;
	}
	return REM_PATTERN.test(trimmed) || BARE_NUMBER_PATTERN.test(trimmed);
}
