import { useMemo, useSyncExternalStore, type ReactNode } from 'react';
import {
	getReducedMotionSnapshot,
	subscribeReducedMotion,
} from '@ohJohny/theme-builder-core';

import { ReducedMotionContext } from './ReducedMotionContext';

export type ReducedMotionProviderProps = {
	/** When set, overrides the OS `prefers-reduced-motion` preference for this subtree. */
	readonly reducedMotion?: boolean;
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

	const reducedMotion = reducedMotionOverride ?? reducedMotionFromOs;

	const value = useMemo(() => ({ reducedMotion }), [reducedMotion]);

	return (
		<ReducedMotionContext.Provider value={value}>{children}</ReducedMotionContext.Provider>
	);
}
