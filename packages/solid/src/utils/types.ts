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

export type DeviceMatches = Record<DeviceSizeName, boolean>;

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
