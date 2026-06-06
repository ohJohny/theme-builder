import { useMemo, type ReactNode } from 'react';

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
	readonly children: ReactNode;
};

/**
 * Optional subtree defaults for `useDeviceSize`. Does **not** attach
 * `resize` listeners — width updates come from the shared ref-counted
 * subscription used by that hook.
 */
export function DeviceSizeProvider(props: DeviceSizeProviderProps) {
	const { breakpoints, breakpointsRem, children } = props;

	const value = useMemo(
		() => ({
			breakpoints: mergeBreakpoints(
				mergeBreakpoints(DEFAULT_DEVICE_BREAKPOINTS, breakpointsRem),
				breakpoints,
			),
		}),
		[breakpoints, breakpointsRem],
	);

	return (
		<DeviceSizeContext.Provider value={value}>{children}</DeviceSizeContext.Provider>
	);
}
