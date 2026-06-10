import { createContext, useContext, type Accessor } from 'solid-js';

export type ReducedMotionContextValue = {
	readonly reducedMotion: Accessor<boolean>;
};

export const ReducedMotionContext = createContext<ReducedMotionContextValue>();

export function useReducedMotionContext(): ReducedMotionContextValue {
	const ctx = useContext(ReducedMotionContext);
	if (!ctx) {
		throw new Error('useReducedMotionContext must be used within ThemeProvider');
	}
	return ctx;
}
