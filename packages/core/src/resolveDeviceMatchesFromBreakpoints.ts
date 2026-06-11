import type { BreakpointValue, ThemeConfigInput } from './config/types';
import { remLengthToPx } from './utils/remLength.js';

function breakpointMatches(
	widthPx: number,
	value: BreakpointValue,
	rootFontPx: number,
): boolean {
	const min =
		'min' in value && value.min !== undefined
			? remLengthToPx(value.min, rootFontPx)
			: undefined;
	const max =
		'max' in value && value.max !== undefined
			? remLengthToPx(value.max, rootFontPx)
			: undefined;

	if (min !== undefined && widthPx < min) {
		return false;
	}
	if (max !== undefined && widthPx > max) {
		return false;
	}
	return min !== undefined || max !== undefined;
}

/** Evaluates `config.breakpoints` names against viewport width (px). */
export function resolveDeviceMatchesFromBreakpoints(
	config: ThemeConfigInput,
	widthPx: number,
	rootFontPx = 16,
): Readonly<Record<string, boolean>> {
	const breakpoints = config.breakpoints;
	if (!breakpoints || Object.keys(breakpoints).length === 0) {
		return {};
	}

	const matches: Record<string, boolean> = {};
	for (const [name, value] of Object.entries(breakpoints)) {
		matches[name] = breakpointMatches(widthPx, value, rootFontPx);
	}
	return matches;
}
