import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ThemeProvider } from './ThemeProvider';
import { useUtilityClasses } from './useUtilityClasses';
import { reactTestTheme } from '../testFixtures';

import type { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider theme={reactTestTheme} presetColorScheme="light" applyColorSchemeOnMount={false}>
			{children}
		</ThemeProvider>
	);
}

describe('useUtilityClasses', () => {
	const theme = reactTestTheme.theme;

	it('throws when used outside ThemeProvider', () => {
		expect(() => renderHook(() => useUtilityClasses({ px: 'md' }))).toThrow(ReferenceError);
	});

	it('resolves spacing and color utility props from context theme', () => {
		const { result } = renderHook(
			() => useUtilityClasses({ px: 'md', color: 'text-primary', bg: 'surface-main' }),
			{ wrapper },
		);

		expect(result.current.className).toContain(theme.spacing.px.md.class);
		expect(result.current.className).toContain('color-text-primary');
		expect(result.current.className).toContain('bg-surface-main');
		expect(result.current.style).toEqual({});
	});

	it('merges pass-through className', () => {
		const { result } = renderHook(
			() => useUtilityClasses({ className: 'custom', py: 'sm' }),
			{ wrapper },
		);

		expect(result.current.className).toMatch(/^custom /);
		expect(result.current.className).toContain(theme.spacing.py.sm.class);
	});
});
