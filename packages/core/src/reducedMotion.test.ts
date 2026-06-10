import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	applyReducedMotion,
	getReducedMotionSnapshot,
	resetReducedMotionForTests,
	subscribeReducedMotion,
} from './reducedMotion';

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

describe('reducedMotion', () => {
	beforeEach(() => {
		resetReducedMotionForTests();
		document.documentElement.removeAttribute('data-reduced-motion');
	});

	afterEach(() => {
		resetReducedMotionForTests();
		vi.restoreAllMocks();
	});

	it('applyReducedMotion sets and removes data-reduced-motion', () => {
		applyReducedMotion(true);
		expect(document.documentElement.getAttribute('data-reduced-motion')).toBe('true');

		applyReducedMotion(false);
		expect(document.documentElement.hasAttribute('data-reduced-motion')).toBe(false);
	});

	it('getReducedMotionSnapshot reflects matchMedia on first subscribe', () => {
		const mq = createMediaQueryList(true);
		vi.spyOn(window, 'matchMedia').mockReturnValue(mq);

		expect(getReducedMotionSnapshot()).toBe(false);

		const unsub = subscribeReducedMotion(() => {});

		expect(getReducedMotionSnapshot()).toBe(true);
		expect(document.documentElement.getAttribute('data-reduced-motion')).toBe('true');

		unsub();
	});

	it('notifies subscribers when preference changes', () => {
		const mq = createMediaQueryList(false);
		vi.spyOn(window, 'matchMedia').mockReturnValue(mq);

		const listener = vi.fn();
		const unsub = subscribeReducedMotion(listener);

		expect(listener).not.toHaveBeenCalled();

		mq._dispatch(true);

		expect(getReducedMotionSnapshot()).toBe(true);
		expect(listener).toHaveBeenCalledTimes(1);
		expect(document.documentElement.getAttribute('data-reduced-motion')).toBe('true');

		unsub();
	});

	it('uses one matchMedia change listener for multiple subscribers', () => {
		const mq = createMediaQueryList(false);
		vi.spyOn(window, 'matchMedia').mockReturnValue(mq);

		const unsub1 = subscribeReducedMotion(() => {});
		const unsub2 = subscribeReducedMotion(() => {});

		expect(mq.addEventListener).toHaveBeenCalledTimes(1);

		unsub1();
		expect(mq.removeEventListener).not.toHaveBeenCalled();

		unsub2();
		expect(mq.removeEventListener).toHaveBeenCalledTimes(1);
	});

	it('removes data-reduced-motion when last subscriber unsubscribes', () => {
		const mq = createMediaQueryList(true);
		vi.spyOn(window, 'matchMedia').mockReturnValue(mq);

		const unsub = subscribeReducedMotion(() => {});
		expect(document.documentElement.getAttribute('data-reduced-motion')).toBe('true');

		unsub();
		expect(document.documentElement.hasAttribute('data-reduced-motion')).toBe(false);
	});
});
