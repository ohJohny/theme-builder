import { remLengthToPx } from '@ohJohny/theme-builder-core';

import type { DeviceBreakpoints, DeviceBreakpointsPx, DeviceMatches } from './types';

export const DEFAULT_DEVICE_BREAKPOINTS: DeviceBreakpoints = {
	tabletMin: 48,
	desktopMin: 62,
	wideMin: 80,
};

/** @deprecated Use {@link DEFAULT_DEVICE_BREAKPOINTS} */
export const DEFAULT_DEVICE_BREAKPOINTS_REM = DEFAULT_DEVICE_BREAKPOINTS;

export function getRootFontSizePx(): number {
	if (typeof document === 'undefined') return 16;
	const raw = getComputedStyle(document.documentElement).fontSize;
	const n = parseFloat(raw);
	return Number.isFinite(n) && n > 0 ? n : 16;
}

export function breakpointsToPx(
	breakpoints: DeviceBreakpoints,
	rootFontPx: number,
): DeviceBreakpointsPx {
	return {
		tabletMin: remLengthToPx(breakpoints.tabletMin, rootFontPx),
		desktopMin: remLengthToPx(breakpoints.desktopMin, rootFontPx),
		wideMin: remLengthToPx(breakpoints.wideMin, rootFontPx),
	};
}

/** @deprecated Use {@link breakpointsToPx} */
export function remBreakpointsToPx(
	breakpoints: DeviceBreakpoints,
	rootFontPx: number,
): DeviceBreakpointsPx {
	return breakpointsToPx(breakpoints, rootFontPx);
}

/** Mutually exclusive bands: mobile, tablet, desktop, wide (by ascending width). */
export function computeMatches(widthPx: number, t: DeviceBreakpointsPx): DeviceMatches {
	return {
		mobile: widthPx < t.tabletMin,
		tablet: widthPx >= t.tabletMin && widthPx < t.desktopMin,
		desktop: widthPx >= t.desktopMin && widthPx < t.wideMin,
		wide: widthPx >= t.wideMin,
	};
}

export function mergeBreakpoints(
	base: DeviceBreakpoints,
	partial?: Partial<DeviceBreakpoints>,
): DeviceBreakpoints {
	if (!partial) return base;
	return {
		tabletMin: partial.tabletMin ?? base.tabletMin,
		desktopMin: partial.desktopMin ?? base.desktopMin,
		wideMin: partial.wideMin ?? base.wideMin,
	};
}

/** @deprecated Use {@link mergeBreakpoints} */
export function mergeBreakpointsRem(
	base: DeviceBreakpoints,
	partial?: Partial<DeviceBreakpoints>,
): DeviceBreakpoints {
	return mergeBreakpoints(base, partial);
}
