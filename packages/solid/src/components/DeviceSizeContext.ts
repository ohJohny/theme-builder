import { createContext, type Accessor } from 'solid-js';

import type { DeviceBreakpointsRem } from '../utils/types';

export type DeviceSizeContextValue = {
	readonly breakpointsRem: DeviceBreakpointsRem;
};

export const DeviceSizeContext = createContext<Accessor<DeviceSizeContextValue> | undefined>(
	undefined,
);
