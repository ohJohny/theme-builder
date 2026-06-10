/** @jsxImportSource solid-js */
import { render, screen } from '@solidjs/testing-library';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { resetReducedMotionForTests } from '@ohJohny/theme-builder-core';

import { useReducedMotion } from './useReducedMotion';

function ReducedMotionReadout() {
	const reduced = useReducedMotion();
	return <span data-testid="r">{String(reduced())}</span>;
}

function createMediaQueryList(initialMatches: boolean) {
	const listeners = new Set<(event: MediaQueryListEvent) => void>();
	const state = { matches: initialMatches };
	const mq = {
		get matches() {
			return state.matches;
		},
		media: '(prefers-reduced-motion: reduce)',
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn((_: string, handler: (event: MediaQueryListEvent) => void) => {
			listeners.add(handler);
		}),
		removeEventListener: vi.fn((_: string, handler: (event: MediaQueryListEvent) => void) => {
			listeners.delete(handler);
		}),
		dispatchEvent: vi.fn(),
		_dispatch(matchesValue: boolean) {
			state.matches = matchesValue;
			for (const handler of listeners) {
				handler({ matches: matchesValue } as MediaQueryListEvent);
			}
		},
	} as MediaQueryList & { _dispatch(matches: boolean): void };
	return mq;
}

describe('useReducedMotion', () => {
	afterEach(() => {
		resetReducedMotionForTests();
		vi.restoreAllMocks();
	});

	it('subscribes once for multiple mounted hooks (shared listener)', () => {
		const mq = createMediaQueryList(false);
		const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockReturnValue(mq);

		const { unmount } = render(() => (
			<>
				<ReducedMotionReadout />
				<ReducedMotionReadout />
			</>
		));

		expect(matchMediaSpy).toHaveBeenCalledTimes(1);
		expect(mq.addEventListener).toHaveBeenCalledTimes(1);
		expect(screen.getAllByTestId('r').every((el) => el.textContent === 'false')).toBe(true);

		unmount();
	});

	it('updates when prefers-reduced-motion changes', () => {
		const mq = createMediaQueryList(false);
		vi.spyOn(window, 'matchMedia').mockReturnValue(mq);

		const { unmount } = render(() => <ReducedMotionReadout />);

		expect(screen.getByTestId('r').textContent).toBe('false');

		mq._dispatch(true);

		expect(screen.getByTestId('r').textContent).toBe('true');

		unmount();
	});
});
