/** @jsxImportSource solid-js */
import { createMemo, type ParentComponent } from 'solid-js';

import type { DeviceSizeName } from '../utils/types';
import { useDeviceSize } from './useDeviceSize';

export type DeviceMatchProps = {
	readonly size: DeviceSizeName;
};

/**
 * Renders `children` only when the current viewport matches the given `size`
 * (same buckets as {@link useDeviceSize}). Uses the same ref-counted `resize`
 * subscription as `useDeviceSize`. Ancestor `DeviceSizeProvider` can supply
 * default `breakpointsRem`.
 */
export const DeviceMatch: ParentComponent<DeviceMatchProps> = (props) => {
	const matches = useDeviceSize();
	// Prefer `createMemo` over `<Show>` here: `<Show when={…}>{props.children}</Show>` can
	// still evaluate/commit children in edge cases (first paint vs `matches`, non-lazy
	// children). Solid’s deferred pattern is `<Show when={…}>{() => props.children}</Show>`
	const content = createMemo(() =>
		matches()[props.size] ? props.children : null,
	);
	return <>{content()}</>;
};
