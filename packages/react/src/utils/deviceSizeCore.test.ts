import { describe, expect, it } from 'vitest';

import { breakpointsToPx, computeMatches } from './deviceSizeCore';

const px16 = {
	tabletMin: 48 * 16,
	desktopMin: 62 * 16,
	wideMin: 80 * 16,
};

describe('breakpointsToPx', () => {
	it('converts rem numbers and strings', () => {
		expect(
			breakpointsToPx(
				{ tabletMin: 48, desktopMin: '62rem', wideMin: '80' },
				16,
			),
		).toEqual({
			tabletMin: 768,
			desktopMin: 992,
			wideMin: 1280,
		});
	});
});

describe('computeMatches', () => {
	it('classifies four bands exclusively', () => {
		expect(computeMatches(100, px16)).toEqual({
			mobile: true,
			tablet: false,
			desktop: false,
			wide: false,
		});
		expect(computeMatches(48 * 16, px16)).toEqual({
			mobile: false,
			tablet: true,
			desktop: false,
			wide: false,
		});
		expect(computeMatches(62 * 16, px16)).toEqual({
			mobile: false,
			tablet: false,
			desktop: true,
			wide: false,
		});
		expect(computeMatches(80 * 16, px16)).toEqual({
			mobile: false,
			tablet: false,
			desktop: false,
			wide: true,
		});
	});
});
