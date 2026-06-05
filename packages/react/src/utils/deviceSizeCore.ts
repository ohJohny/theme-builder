import type { DeviceBreakpointsPx, DeviceBreakpointsRem, DeviceMatches } from './types';

export const DEFAULT_DEVICE_BREAKPOINTS_REM: DeviceBreakpointsRem = {
	tabletMinRem: 48,
	desktopMinRem: 62,
	wideMinRem: 80,
};

export function getRootFontSizePx(): number {
	if (typeof document === 'undefined') return 16;
	const raw = getComputedStyle(document.documentElement).fontSize;
	const n = parseFloat(raw);
	return Number.isFinite(n) && n > 0 ? n : 16;
}

export function remBreakpointsToPx(
	breakpointsRem: DeviceBreakpointsRem,
	rootFontPx: number,
): DeviceBreakpointsPx {
	return {
		tabletMin: breakpointsRem.tabletMinRem * rootFontPx,
		desktopMin: breakpointsRem.desktopMinRem * rootFontPx,
		wideMin: breakpointsRem.wideMinRem * rootFontPx,
	};
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

export function mergeBreakpointsRem(
	base: DeviceBreakpointsRem,
	partial?: Partial<DeviceBreakpointsRem>,
): DeviceBreakpointsRem {
	if (!partial) return base;
	return {
		tabletMinRem: partial.tabletMinRem ?? base.tabletMinRem,
		desktopMinRem: partial.desktopMinRem ?? base.desktopMinRem,
		wideMinRem: partial.wideMinRem ?? base.wideMinRem,
	};
}
