import { useMemo, useSyncExternalStore, type ReactNode } from 'react';
import {
	getReducedMotionSnapshot,
	resolveReducedMotion,
	subscribeReducedMotion,
	type ReducedMotionPreference,
} from '@ohJohny/theme-builder-core';

import { ReducedMotionContext } from './ReducedMotionContext';

export type ReducedMotionProviderProps = {
	/**
	 * `true` / `false` force reduced motion on or off; `'auto'` (default) follows
	 * OS `prefers-reduced-motion`. `false` is not recommended — prefer `'auto'`.
	 */
	readonly reducedMotion?: ReducedMotionPreference;
	readonly children: ReactNode;
};

/**
 * Subscribes to the shared `prefers-reduced-motion` pipeline and exposes
 * `reducedMotion` on context. Mounted by {@link ThemeProviderTree}.
 */
export function ReducedMotionProvider(props: ReducedMotionProviderProps) {
	const { reducedMotion: reducedMotionOverride, children } = props;

	const reducedMotionFromOs = useSyncExternalStore(
		subscribeReducedMotion,
		getReducedMotionSnapshot,
		getReducedMotionSnapshot,
	);

	const reducedMotion = resolveReducedMotion(reducedMotionOverride, reducedMotionFromOs);

	const value = useMemo(() => ({ reducedMotion }), [reducedMotion]);

	return (
		<ReducedMotionContext.Provider value={value}>{children}</ReducedMotionContext.Provider>
	);
}
