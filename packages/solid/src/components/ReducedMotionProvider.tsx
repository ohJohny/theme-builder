/** @jsxImportSource solid-js */
import {
	createMemo,
	createSignal,
	onCleanup,
	splitProps,
	type Accessor,
	type JSX,
} from 'solid-js';
import {
	getReducedMotionSnapshot,
	subscribeReducedMotion,
} from '@ohJohny/theme-builder-core';

import { ReducedMotionContext } from './ReducedMotionContext';

export type ReducedMotionProviderProps = {
	/** When set, overrides the OS `prefers-reduced-motion` preference for this subtree. */
	readonly reducedMotion?: boolean;
};

/**
 * Subscribes to the shared `prefers-reduced-motion` pipeline and exposes
 * `reducedMotion` on context. Mounted by {@link ThemeProvider}.
 */
export function ReducedMotionProvider(
	props: ReducedMotionProviderProps & { children?: JSX.Element },
) {
	const [local] = splitProps(props, ['children', 'reducedMotion']);

	const [reducedMotionFromOs, setReducedMotionFromOs] = createSignal(false);
	const unsub = subscribeReducedMotion(() => {
		setReducedMotionFromOs(getReducedMotionSnapshot());
	});
	setReducedMotionFromOs(getReducedMotionSnapshot());
	onCleanup(unsub);

	const reducedMotion: Accessor<boolean> = createMemo(() =>
		local.reducedMotion !== undefined ? local.reducedMotion : reducedMotionFromOs(),
	);

	const value = { reducedMotion };

	return (
		<ReducedMotionContext.Provider value={value}>{local.children}</ReducedMotionContext.Provider>
	);
}
