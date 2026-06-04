import type { ColorSchemeId } from './colorScheme.types';

export function applyColorScheme(id: ColorSchemeId): void {
	if (typeof document === 'undefined') return;
	document.documentElement.setAttribute('data-theme', id);
}
