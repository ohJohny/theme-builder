import { normalizeVariableName } from './utils/css-variables';

export function resolveThemeVariableTarget(
	target?: HTMLElement | Document,
): HTMLElement | undefined {
	if (typeof document === 'undefined') return undefined;
	if (target === undefined) return document.documentElement;
	if (target instanceof Document) return target.documentElement;
	return target;
}

/**
 * Applies CSS custom properties on `target` (default `:root`).
 * Returns normalized variable names that were set (for cleanup).
 */
export function applyThemeVariables(
	variables: Record<string, string> | undefined,
	target?: HTMLElement | Document,
	previousKeys: readonly string[] = [],
): string[] {
	const element = resolveThemeVariableTarget(target);
	if (element === undefined) {
		return variables ? Object.keys(variables).map(normalizeVariableName) : [];
	}

	const nextKeys = new Set<string>();

	if (variables) {
		for (const [key, value] of Object.entries(variables)) {
			const name = normalizeVariableName(key);
			nextKeys.add(name);
			element.style.setProperty(name, value);
		}
	}

	for (const key of previousKeys) {
		if (!nextKeys.has(key)) {
			element.style.removeProperty(key);
		}
	}

	return [...nextKeys];
}
