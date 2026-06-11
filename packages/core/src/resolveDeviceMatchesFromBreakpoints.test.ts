import { describe, expect, it } from 'vitest';

import { defineThemeConfig } from './config/defineThemeConfig';
import { resolveDeviceMatchesFromBreakpoints } from './resolveDeviceMatchesFromBreakpoints';

describe('resolveDeviceMatchesFromBreakpoints', () => {
	it('evaluates named breakpoints from theme config', () => {
		const config = defineThemeConfig({
			breakpoints: {
				mobile: { max: 48 },
				desktop: { min: 48 },
			},
		});

		expect(resolveDeviceMatchesFromBreakpoints(config, 400, 16)).toEqual({
			mobile: true,
			desktop: false,
		});
		expect(resolveDeviceMatchesFromBreakpoints(config, 900, 16)).toEqual({
			mobile: false,
			desktop: true,
		});
	});
});
