/** @jsxImportSource solid-js */
import { render } from '@solidjs/testing-library';
import { describe, expect, it } from 'vitest';

import { ThemeProvider } from './ThemeProvider';
import { useUtilityClasses } from './useUtilityClasses';
import { solidTestTheme } from '../testFixtures';

function UtilityReadout() {
	const result = useUtilityClasses({ px: 'md', color: 'text-primary', bg: 'surface-main' });
	return (
		<div data-testid="out" data-class={result.className} data-style={JSON.stringify(result.style)} />
	);
}

describe('useUtilityClasses', () => {
	const theme = solidTestTheme.theme;

	it('resolves spacing and color utility props from context theme', () => {
		const { getByTestId, unmount } = render(() => (
			<ThemeProvider theme={solidTestTheme} presetColorScheme="light" applyColorSchemeOnMount={false}>
				<UtilityReadout />
			</ThemeProvider>
		));

		const out = getByTestId('out');
		expect(out.getAttribute('data-class')).toContain(theme.spacing.px.md.class);
		expect(out.getAttribute('data-class')).toContain('color-text-primary');
		expect(out.getAttribute('data-class')).toContain('bg-surface-main');
		expect(out.getAttribute('data-style')).toBe('{}');
		unmount();
	});
});
