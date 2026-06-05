export type DeviceSizeName = 'mobile' | 'tablet' | 'desktop' | 'wide';

export type DeviceBreakpointsRem = {
	readonly tabletMinRem: number;
	readonly desktopMinRem: number;
	readonly wideMinRem: number;
};

export type DeviceMatches = Record<DeviceSizeName, boolean>;

export type DeviceBreakpointsPx = {
	readonly tabletMin: number;
	readonly desktopMin: number;
	readonly wideMin: number;
};

export type UseDeviceSizeOptions = {
	readonly breakpointsRem?: Partial<DeviceBreakpointsRem>;
};
