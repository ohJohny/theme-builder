/** @jsxImportSource solid-js */
import { createMemo, mergeProps, type ParentComponent } from 'solid-js';

import {
	DEFAULT_DEVICE_BREAKPOINTS_REM,
	mergeBreakpointsRem,
} from '../utils/deviceSizeCore';
import { DeviceSizeContext } from './DeviceSizeContext';
import type { DeviceBreakpointsRem } from '../utils/types';

export type DeviceSizeProviderProps = {
	readonly breakpointsRem?: Partial<DeviceBreakpointsRem>;
};

/**
 * Optional subtree defaults for `useDeviceSize` and `DeviceMatch`. Does **not**
 * attach `resize` listeners — width updates come from the shared ref-counted
 * subscription used by those APIs.
 */
export const DeviceSizeProvider: ParentComponent<DeviceSizeProviderProps> = (props) => {
	const merged = mergeProps(
		{
			breakpointsRem: {} as Partial<DeviceBreakpointsRem>,
		},
		props,
	);
	const value = createMemo(() => ({
		breakpointsRem: mergeBreakpointsRem(
			DEFAULT_DEVICE_BREAKPOINTS_REM,
			merged.breakpointsRem,
		),
	}));
	return (
		<DeviceSizeContext.Provider value={value}>
			{merged.children}
		</DeviceSizeContext.Provider>
	);
};
