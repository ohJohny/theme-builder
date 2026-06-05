import { useMemo, type ReactNode } from 'react';

import {
	DEFAULT_DEVICE_BREAKPOINTS_REM,
	mergeBreakpointsRem,
} from '../utils/deviceSizeCore';
import { DeviceSizeContext } from './DeviceSizeContext';
import type { DeviceBreakpointsRem } from '../utils/types';

export type DeviceSizeProviderProps = {
	readonly breakpointsRem?: Partial<DeviceBreakpointsRem>;
	readonly children: ReactNode;
};

/**
 * Optional subtree defaults for `useDeviceSize`. Does **not** attach
 * `resize` listeners — width updates come from the shared ref-counted
 * subscription used by that hook.
 */
export function DeviceSizeProvider(props: DeviceSizeProviderProps) {
	const { breakpointsRem, children } = props;

	const value = useMemo(
		() => ({
			breakpointsRem: mergeBreakpointsRem(
				DEFAULT_DEVICE_BREAKPOINTS_REM,
				breakpointsRem,
			),
		}),
		[breakpointsRem],
	);

	return (
		<DeviceSizeContext.Provider value={value}>{children}</DeviceSizeContext.Provider>
	);
}
