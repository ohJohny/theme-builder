let injectCounter = 0;

export function injectThemeStyles(cssText: string, id?: string): HTMLStyleElement | null {
	if (typeof document === 'undefined') return null;

	const elementId = id ?? `theme-builder-injected-${++injectCounter}`;
	let element = document.getElementById(elementId) as HTMLStyleElement | null;
	if (element === null) {
		element = document.createElement('style');
		element.id = elementId;
		document.head.appendChild(element);
	}
	element.textContent = cssText;
	return element;
}

export function removeInjectedThemeStyles(id: string): void {
	if (typeof document === 'undefined') return;
	document.getElementById(id)?.remove();
}
