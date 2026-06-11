import { useSyncExternalStore } from 'react';

import { useColorSchemeContext } from './ColorSchemeContext';

export function useColorScheme() {
	const ctx = useColorSchemeContext();
	const state = useSyncExternalStore(ctx.subscribe, ctx.getState, ctx.getState);

	return {
		colorScheme: state.colorScheme,
		resolvedColorScheme: state.resolvedColorScheme,
		colorSchemeList: state.colorSchemeList,
		labelShort: state.labelShort,
		changeColorScheme: ctx.changeColorScheme,
	};
}
