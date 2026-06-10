import type { Accessor } from 'solid-js';
import { createSignal, onCleanup, useContext } from 'solid-js';
import {
	getReducedMotionSnapshot,
	subscribeReducedMotion,
} from '@ohJohny/theme-builder-core';

import { ReducedMotionContext } from './ReducedMotionContext';

/**
 * Reactive `prefers-reduced-motion` preference.
 *
 * Under {@link ThemeProvider}, reads `reducedMotion` from context (including an
 * optional provider override). Otherwise uses a **shared ref-counted**
 * `matchMedia` subscription. While the OS pipeline is active,
 * `data-reduced-motion="true"` is set on `document.documentElement` when the
 * preference is active.
 */
export function useReducedMotion(): Accessor<boolean> {
	const ctx = useContext(ReducedMotionContext);

	const [reducedMotionFromOs, setReducedMotionFromOs] = createSignal(false);
	const unsub = subscribeReducedMotion(() => {
		setReducedMotionFromOs(getReducedMotionSnapshot());
	});
	setReducedMotionFromOs(getReducedMotionSnapshot());
	onCleanup(unsub);

	if (ctx) {
		return ctx.reducedMotion;
	}

	return reducedMotionFromOs;
}
