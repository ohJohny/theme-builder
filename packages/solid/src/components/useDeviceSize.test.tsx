/** @jsxImportSource solid-js */
import { render, screen } from '@solidjs/testing-library';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DeviceMatch } from './DeviceMatch';
import { DeviceSizeProvider } from './DeviceSizeProvider';
import { useDeviceSize } from './useDeviceSize';

function MatchesReadout() {
	const matches = useDeviceSize();
	return <span data-testid="m">{String(matches().mobile)}</span>;
}

describe('useDeviceSize', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('subscribes once for multiple mounted hooks (shared listener)', () => {
		const addSpy = vi.spyOn(window, 'addEventListener');
		Object.defineProperty(window, 'innerWidth', {
			configurable: true,
			writable: true,
			value: 400,
		});

		const { unmount } = render(() => (
			<>
				<MatchesReadout />
				<MatchesReadout />
			</>
		));

		const resizeAdds = addSpy.mock.calls.filter((c) => c[0] === 'resize');
		expect(resizeAdds.length).toBe(1);

		unmount();
	});

	it('applies DeviceSizeProvider breakpoints for descendants', () => {
		Object.defineProperty(window, 'innerWidth', {
			configurable: true,
			writable: true,
			value: 50 * 16,
		});

		function MatchTablet() {
			const matches = useDeviceSize();
			return <span data-testid="t">{String(matches().tablet)}</span>;
		}

		const { unmount } = render(() => (
			<DeviceSizeProvider>
				<MatchTablet />
			</DeviceSizeProvider>
		));

		expect(screen.getByTestId('t').textContent).toBe('true');
		unmount();
	});
});

describe('DeviceMatch', () => {
	it('renders children only when size matches', () => {
		Object.defineProperty(window, 'innerWidth', {
			configurable: true,
			writable: true,
			value: 1000,
		});

		const { unmount } = render(() => (
			<DeviceSizeProvider>
				<DeviceMatch size="tablet">
					<span data-testid="c">x</span>
				</DeviceMatch>
			</DeviceSizeProvider>
		));

		expect(screen.queryByTestId('c')).toBeNull();
		unmount();
	});
});
