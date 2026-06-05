import { createMemo } from 'solid-js';

import {
	resolveUtilityClasses,
	type UtilityClassesResult,
	type UtilityProps,
} from '@ohJohny/theme-builder-core';

import { useTheme } from './useTheme';

/** Resolves utility props; returns a memoized accessor for className + style. */
export function useUtilityClasses(props: UtilityProps | (() => UtilityProps)): () => UtilityClassesResult {
	const theme = useTheme();
	return createMemo(() => {
		const resolved = typeof props === 'function' ? props() : props;
		return resolveUtilityClasses(resolved, theme);
	});
}

export type { UtilityClassesResult, UtilityProps } from '@ohJohny/theme-builder-core';
