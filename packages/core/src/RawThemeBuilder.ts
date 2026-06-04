import { applyThemeVariables, resolveThemeVariableTarget } from './applyThemeVariables';
import type { ThemeExtension } from './mergeTheme';
import { parseRawThemeConfig, type RawThemeConfig } from './rawThemeConfig';
import { buildRawThemeStylesheet, buildRawThemeVariables } from './rawThemeDom';
import { rawThemeConfigToExtension } from './rawThemeToExtension';
import { ThemeBuilder } from './ThemeBuilder';

export type RawThemeTarget = HTMLElement | Document | undefined;

export type RawThemeApplyOptions = {
	/** When true (default), merges into `ThemeBuilder` singleton via `extend`. */
	readonly extendSingleton?: boolean;
	/**
	 * When true (default), sets CSS custom properties on the DOM target.
	 * Set false when color variables are driven by `[data-theme]` CSS so inline
	 * values do not override scheme-specific rules.
	 */
	readonly inlineVariables?: boolean;
};

let rawThemeInstanceCounter = 0;

function injectStylesheet(id: string, cssText: string): HTMLStyleElement | null {
	if (typeof document === 'undefined') return null;

	let element = document.getElementById(id) as HTMLStyleElement | null;
	if (element === null) {
		element = document.createElement('style');
		element.id = id;
		document.head.appendChild(element);
	}
	element.textContent = cssText;
	return element;
}

function removeStylesheet(id: string): void {
	if (typeof document === 'undefined') return;
	document.getElementById(id)?.remove();
}

/** When false, only `--color-*` vars are omitted so `[data-theme]` CSS can own colors. */
function variablesForInlineApply(
	config: RawThemeConfig,
	inlineVariables: boolean,
): Record<string, string> {
	const all = buildRawThemeVariables(config);
	if (inlineVariables) return all;
	return Object.fromEntries(
		Object.entries(all).filter(([key]) => !key.startsWith('--color-')),
	);
}

/**
 * Builds runtime theme tokens from JSON name/value maps: CSS variables on a DOM
 * target, canonical utility classes (injected stylesheet), and optional singleton extend.
 *
 * Each `apply()` merges into prior DOM state. Call `dispose()` then `apply()` to reset.
 */
export class RawThemeBuilder {
	private static instance: RawThemeBuilder | undefined;
	private readonly styleElementId: string;
	private appliedVarKeys: string[] = [];
	private cssRules: string[] = [];
	private lastTarget: HTMLElement | undefined;

	private constructor() {
		rawThemeInstanceCounter += 1;
		this.styleElementId = `c0-raw-theme-${rawThemeInstanceCounter}`;
	}

	static getInstance(): RawThemeBuilder {
		if (RawThemeBuilder.instance === undefined) {
			RawThemeBuilder.instance = new RawThemeBuilder();
		}
		return RawThemeBuilder.instance;
	}

	toThemeExtension(config: RawThemeConfig | string): ThemeExtension {
		return rawThemeConfigToExtension(parseRawThemeConfig(config));
	}

	apply(
		config: RawThemeConfig | string,
		target?: RawThemeTarget,
		options: RawThemeApplyOptions = {},
	): ThemeExtension {
		const parsed = parseRawThemeConfig(config);
		const { extendSingleton = true, inlineVariables = true } = options;
		const resolvedTarget = resolveThemeVariableTarget(target);
		this.lastTarget = resolvedTarget;

		const variables = variablesForInlineApply(parsed, inlineVariables);
		if (Object.keys(variables).length > 0) {
			const newKeys = applyThemeVariables(variables, target, []);
			this.appliedVarKeys = [...new Set([...this.appliedVarKeys, ...newKeys])];
		}

		const cssText = buildRawThemeStylesheet(parsed);
		if (cssText.length > 0) {
			this.cssRules.push(...cssText.split('\n').filter((rule) => rule.length > 0));
			injectStylesheet(this.styleElementId, this.cssRules.join('\n'));
		}

		const extension = rawThemeConfigToExtension(parsed);
		if (extendSingleton) {
			ThemeBuilder.getInstance().extend(extension);
		}

		return extension;
	}

	dispose(target?: RawThemeTarget): void {
		const resolvedTarget = resolveThemeVariableTarget(target ?? this.lastTarget);
		if (resolvedTarget !== undefined) {
			for (const key of this.appliedVarKeys) {
				resolvedTarget.style.removeProperty(key);
			}
		}
		this.appliedVarKeys = [];
		this.cssRules = [];
		removeStylesheet(this.styleElementId);
	}
}
