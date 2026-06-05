import { createContext } from 'react';

import type { DeviceBreakpointsRem } from '../utils/types';

export type DeviceSizeContextValue = {
	readonly breakpointsRem: DeviceBreakpointsRem;
};

export const DeviceSizeContext = createContext<DeviceSizeContextValue | null>(null);
