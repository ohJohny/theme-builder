import { useSyncExternalStore } from 'react';

import { useColorSchemeContext } from './ColorSchemeContext';

export function useColorScheme() {
	const ctx = useColorSchemeContext();
	const state = useSyncExternalStore(ctx.subscribe, ctx.getState, ctx.getState);

	return {
		colorScheme: state.colorScheme,
		colorSchemeList: state.colorSchemeList,
		labelShort: state.labelShort,
		changeColorScheme: ctx.changeColorScheme,
	};
}
