import { useEffect, type RefObject } from 'react';

import { updateColorSchemeTogglePosition } from '@ohJohny/theme-builder-core';

export function useColorSchemeTogglePosition(ref: RefObject<HTMLElement | null>): void {
	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const update = () => {
			if (ref.current) updateColorSchemeTogglePosition(ref.current);
		};

		update();

		if (typeof ResizeObserver === 'undefined') return;

		const observer = new ResizeObserver(update);
		observer.observe(el);
		return () => observer.disconnect();
	}, [ref]);
}
