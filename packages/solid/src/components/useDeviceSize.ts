import type { Accessor } from 'solid-js';
import { createMemo, onCleanup, useContext } from 'solid-js';

import {
	breakpointsToPx,
	computeMatches,
	DEFAULT_DEVICE_BREAKPOINTS,
	getRootFontSizePx,
	mergeBreakpoints,
} from '../utils/deviceSizeCore';
import { subscribeSharedWindowWidth } from '../utils/subscribeSharedWindowWidth';
import type { DeviceMatches, UseDeviceSizeOptions } from '../utils/types';
import { DeviceSizeContext } from './DeviceSizeContext';

export type UseDeviceSizeResult = Accessor<DeviceMatches>;

/**
 * Reactive device buckets (`mobile` / `tablet` / `desktop` / `wide`).
 *
 * Driven by a **shared ref-counted** `window` `resize` subscription shared with
 * {@link DeviceMatch}. Subscription runs **synchronously** when the hook is
 * evaluated so the first paint matches the current viewport. Optional
 * {@link DeviceSizeProvider} supplies default `breakpoints`; call-site
 * `options` override context.
 */
export function useDeviceSize(options?: UseDeviceSizeOptions): UseDeviceSizeResult {
	const ctx = useContext(DeviceSizeContext);

	const [width, release] = subscribeSharedWindowWidth();
	onCleanup(release);

	const breakpoints = createMemo(() => {
		const base = ctx?.().breakpoints ?? DEFAULT_DEVICE_BREAKPOINTS;
		return mergeBreakpoints(
			mergeBreakpoints(base, options?.breakpointsRem),
			options?.breakpoints,
		);
	});

	const matches = createMemo(() => {
		const px = breakpointsToPx(breakpoints(), getRootFontSizePx());
		return computeMatches(width(), px);
	});

	return matches;
}
