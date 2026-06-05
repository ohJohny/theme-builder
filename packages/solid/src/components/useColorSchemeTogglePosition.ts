import type { Accessor } from 'solid-js';
import { createRenderEffect, onCleanup } from 'solid-js';

import { updateColorSchemeTogglePosition } from '@ohJohny/theme-builder-core';

export function useColorSchemeTogglePosition(buttonRef: Accessor<HTMLElement | undefined>): void {
	createRenderEffect(() => {
		const el = buttonRef();
		if (!el) return;

		updateColorSchemeTogglePosition(el);

		if (typeof ResizeObserver === 'undefined') return;

		const observer = new ResizeObserver(() => {
			const current = buttonRef();
			if (current) updateColorSchemeTogglePosition(current);
		});
		observer.observe(el);
		onCleanup(() => observer.disconnect());
	});
}
