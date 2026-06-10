import { createContext, useContext } from 'react';

export type ReducedMotionContextValue = {
	readonly reducedMotion: boolean;
};

export const ReducedMotionContext = createContext<ReducedMotionContextValue | null>(null);

export function useReducedMotionContext(): ReducedMotionContextValue {
	const ctx = useContext(ReducedMotionContext);
	if (!ctx) {
		throw new Error('useReducedMotionContext must be used within ThemeProvider');
	}
	return ctx;
}
