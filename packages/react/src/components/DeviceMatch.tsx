import { type ReactNode } from 'react';

import type { DeviceSizeName } from '../utils/types';
import { useDeviceSize } from './useDeviceSize';

export type DeviceMatchProps = {
	readonly size: DeviceSizeName;
	readonly children: ReactNode;
};

/**
 * Renders `children` only when the current viewport matches the given `size`
 * (same buckets as {@link useDeviceSize}). Uses the same ref-counted `resize`
 * subscription as `useDeviceSize`. Ancestor `DeviceSizeProvider` can supply
 * default `breakpointsRem`.
 */
export function DeviceMatch(props: DeviceMatchProps) {
	const matches = useDeviceSize();
	if (!matches[props.size]) return null;
	return <>{props.children}</>;
}
