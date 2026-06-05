import { useContext, useMemo, useSyncExternalStore } from 'react';

import {
	computeMatches,
	DEFAULT_DEVICE_BREAKPOINTS_REM,
	getRootFontSizePx,
	mergeBreakpointsRem,
	remBreakpointsToPx,
} from './deviceSizeCore';
import { DeviceSizeContext } from './DeviceSizeContext';
import {
	getSharedWindowWidthSnapshot,
	subscribeSharedWindowWidth,
} from './subscribeSharedWindowWidth';
import type { DeviceMatches, UseDeviceSizeOptions } from './types';

/**
 * Reactive device buckets (`mobile` / `tablet` / `desktop` / `wide`).
 *
 * Driven by a **shared ref-counted** `window` `resize` subscription.
 * Optional {@link DeviceSizeProvider} supplies default `breakpointsRem`; call-site
 * `options` override context.
 */
export function useDeviceSize(options?: UseDeviceSizeOptions): DeviceMatches {
	const ctx = useContext(DeviceSizeContext);

	const width = useSyncExternalStore(
		subscribeSharedWindowWidth,
		getSharedWindowWidthSnapshot,
		getSharedWindowWidthSnapshot,
	);

	const breakpointsRem = useMemo(() => {
		const base = ctx?.breakpointsRem ?? DEFAULT_DEVICE_BREAKPOINTS_REM;
		return mergeBreakpointsRem(base, options?.breakpointsRem);
	}, [ctx, options?.breakpointsRem]);

	return useMemo(() => {
		const px = remBreakpointsToPx(breakpointsRem, getRootFontSizePx());
		return computeMatches(width, px);
	}, [width, breakpointsRem]);
}
