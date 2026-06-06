import { createContext } from 'solid-js';

import type { DeviceBreakpoints } from '../utils/types';

export type DeviceSizeContextValue = {
	readonly breakpoints: DeviceBreakpoints;
};

export const DeviceSizeContext = createContext<() => DeviceSizeContextValue>();
