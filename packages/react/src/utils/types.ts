import type { RemLength } from '@ohJohny/theme-builder-core';

export type DeviceSizeName = 'mobile' | 'tablet' | 'desktop' | 'wide';

/** Min-width thresholds for tablet / desktop / wide bands (rem). */
export type DeviceBreakpoints = {
	readonly tabletMin: RemLength;
	readonly desktopMin: RemLength;
	readonly wideMin: RemLength;
};

/** @deprecated Use {@link DeviceBreakpoints} — keys are now `tabletMin`, `desktopMin`, `wideMin`. */
export type DeviceBreakpointsRem = DeviceBreakpoints;

/** Legacy bands (`mobile` / `tablet` / `desktop` / `wide`) or `config.breakpoints` keys. */
export type DeviceMatches = Record<string, boolean>;

export type DeviceBreakpointsPx = {
	readonly tabletMin: number;
	readonly desktopMin: number;
	readonly wideMin: number;
};

export type UseDeviceSizeOptions = {
	readonly breakpoints?: Partial<DeviceBreakpoints>;
	/** @deprecated Use {@link UseDeviceSizeOptions.breakpoints} */
	readonly breakpointsRem?: Partial<DeviceBreakpoints>;
};
