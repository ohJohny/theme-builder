import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DeviceMatch } from './DeviceMatch';
import { DeviceSizeProvider } from './DeviceSizeProvider';

describe('DeviceMatch', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders children only when size matches', () => {
		Object.defineProperty(window, 'innerWidth', {
			configurable: true,
			writable: true,
			value: 1000,
		});

		const { unmount } = render(
			<DeviceSizeProvider>
				<DeviceMatch size="tablet">
					<span data-testid="c">x</span>
				</DeviceMatch>
			</DeviceSizeProvider>,
		);

		expect(screen.queryByTestId('c')).toBeNull();
		unmount();
	});

	it('renders children when size matches', () => {
		Object.defineProperty(window, 'innerWidth', {
			configurable: true,
			writable: true,
			value: 50 * 16,
		});

		const { unmount } = render(
			<DeviceSizeProvider>
				<DeviceMatch size="tablet">
					<span data-testid="c">x</span>
				</DeviceMatch>
			</DeviceSizeProvider>,
		);

		expect(screen.getByTestId('c')).toBeTruthy();
		unmount();
	});
});
