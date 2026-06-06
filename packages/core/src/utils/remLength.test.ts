import { describe, expect, it } from 'vitest';

import { formatRemCss, isRemLength, remLengthToPx } from './remLength';

describe('remLength', () => {
	const root = 16;

	it('treats numbers as rem', () => {
		expect(remLengthToPx(48, root)).toBe(768);
		expect(formatRemCss(48)).toBe('48rem');
	});

	it('parses rem strings', () => {
		expect(remLengthToPx('48rem', root)).toBe(768);
		expect(formatRemCss('3.5rem')).toBe('3.5rem');
	});

	it('treats bare numeric strings as rem', () => {
		expect(remLengthToPx('48', root)).toBe(768);
		expect(formatRemCss('48')).toBe('48rem');
	});

	it('rejects px and unsupported units', () => {
		expect(() => remLengthToPx('768px', root)).toThrow(RangeError);
		expect(() => remLengthToPx('48em', root)).toThrow(RangeError);
		expect(isRemLength('768px')).toBe(false);
		expect(isRemLength('48rem')).toBe(true);
		expect(isRemLength(48)).toBe(true);
	});
});
