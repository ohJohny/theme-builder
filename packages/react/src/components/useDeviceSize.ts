import { useContext, useMemo, useSyncExternalStore } from 'react';

import {
	breakpointsToPx,
	computeMatches,
	DEFAULT_DEVICE_BREAKPOINTS,
	getRootFontSizePx,
	mergeBreakpoints,
} from '../utils/deviceSizeCore';
import { DeviceSizeContext } from './DeviceSizeContext';
import {
	getSharedWindowWidthSnapshot,
	subscribeSharedWindowWidth,
} from '../utils/subscribeSharedWindowWidth';
import type { DeviceMatches, UseDeviceSizeOptions } from '../utils/types';

/**
 * Reactive device buckets (`mobile` / `tablet` / `desktop` / `wide`).
 *
 * Driven by a **shared ref-counted** `window` `resize` subscription.
 * Optional {@link DeviceSizeProvider} supplies default `breakpoints`; call-site
 * `options` override context.
 */
export function useDeviceSize(options?: UseDeviceSizeOptions): DeviceMatches {
	const ctx = useContext(DeviceSizeContext);

	const width = useSyncExternalStore(
		subscribeSharedWindowWidth,
		getSharedWindowWidthSnapshot,
		getSharedWindowWidthSnapshot,
	);

	const breakpoints = useMemo(() => {
		const base = ctx?.breakpoints ?? DEFAULT_DEVICE_BREAKPOINTS;
		return mergeBreakpoints(
			mergeBreakpoints(base, options?.breakpointsRem),
			options?.breakpoints,
		);
	}, [ctx, options?.breakpoints, options?.breakpointsRem]);

	return useMemo(() => {
		const px = breakpointsToPx(breakpoints, getRootFontSizePx());
		return computeMatches(width, px);
	}, [width, breakpoints]);
}
