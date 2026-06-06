/** @jsxImportSource solid-js */
import { createMemo, mergeProps, type ParentComponent } from 'solid-js';

import {
	DEFAULT_DEVICE_BREAKPOINTS,
	mergeBreakpoints,
} from '../utils/deviceSizeCore';
import { DeviceSizeContext } from './DeviceSizeContext';
import type { DeviceBreakpoints } from '../utils/types';

export type DeviceSizeProviderProps = {
	readonly breakpoints?: Partial<DeviceBreakpoints>;
	/** @deprecated Use {@link DeviceSizeProviderProps.breakpoints} */
	readonly breakpointsRem?: Partial<DeviceBreakpoints>;
};

/**
 * Optional subtree defaults for `useDeviceSize` and `DeviceMatch`. Does **not**
 * attach `resize` listeners — width updates come from the shared ref-counted
 * subscription used by those APIs.
 */
export const DeviceSizeProvider: ParentComponent<DeviceSizeProviderProps> = (props) => {
	const merged = mergeProps(
		{
			breakpoints: {} as Partial<DeviceBreakpoints>,
			breakpointsRem: {} as Partial<DeviceBreakpoints>,
		},
		props,
	);
	const value = createMemo(() => ({
		breakpoints: mergeBreakpoints(
			mergeBreakpoints(DEFAULT_DEVICE_BREAKPOINTS, merged.breakpointsRem),
			merged.breakpoints,
		),
	}));
	return (
		<DeviceSizeContext.Provider value={value}>
			{merged.children}
		</DeviceSizeContext.Provider>
	);
};
