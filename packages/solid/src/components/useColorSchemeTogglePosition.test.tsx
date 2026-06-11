/** @jsxImportSource solid-js */
import { render, waitFor } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from './ThemeProvider';
import { useColorSchemeTogglePosition } from './useColorSchemeTogglePosition';
import { solidTestTheme } from '../testFixtures';

function ToggleButton() {
	const [button, setButton] = createSignal<HTMLButtonElement>();
	useColorSchemeTogglePosition(button);
	return <button ref={setButton} type="button" />;
}

describe('useColorSchemeTogglePosition', () => {
	beforeEach(() => {
		document.documentElement.style.removeProperty('--cs-toggle-pos-x');
		document.documentElement.style.removeProperty('--cs-toggle-pos-y');
	});

	afterEach(() => {
		document.documentElement.style.removeProperty('--cs-toggle-pos-x');
		document.documentElement.style.removeProperty('--cs-toggle-pos-y');
		vi.restoreAllMocks();
	});

	it('sets toggle center CSS variables after mount', async () => {
		const rect = {
			x: 10,
			y: 20,
			width: 30,
			height: 40,
			top: 20,
			left: 10,
			right: 40,
			bottom: 60,
			toJSON: () => ({}),
		} as DOMRect;

		vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(rect);

		const { unmount } = render(() => (
			<ThemeProvider theme={solidTestTheme} presetColorScheme="light" applyColorSchemeOnMount={false}>
				<ToggleButton />
			</ThemeProvider>
		));

		await waitFor(() => {
			expect(document.documentElement.style.getPropertyValue('--cs-toggle-pos-x')).toBe('25px');
			expect(document.documentElement.style.getPropertyValue('--cs-toggle-pos-y')).toBe('40px');
		});

		unmount();
	});
});
