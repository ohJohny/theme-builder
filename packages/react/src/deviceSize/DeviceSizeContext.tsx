import { createContext } from 'react';

import type { DeviceBreakpointsRem } from './types';

export type DeviceSizeContextValue = {
	readonly breakpointsRem: DeviceBreakpointsRem;
};

export const DeviceSizeContext = createContext<DeviceSizeContextValue | null>(null);
