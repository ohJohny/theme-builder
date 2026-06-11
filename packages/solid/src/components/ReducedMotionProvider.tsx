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
		resolveReducedMotion(local.reducedMotion, reducedMotionFromOs()),
	);

	const value = { reducedMotion };

	return (
		<ReducedMotionContext.Provider value={value}>{local.children}</ReducedMotionContext.Provider>
	);
}
