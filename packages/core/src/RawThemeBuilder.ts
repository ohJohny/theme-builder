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

/**
 * Builds runtime theme tokens from JSON name/value maps: CSS variables on a DOM
 * target, canonical utility classes (injected stylesheet), and optional singleton extend.
 */
export class RawThemeBuilder {
	private static instance: RawThemeBuilder | undefined;
	private readonly styleElementId: string;
	private appliedVarKeys: string[] = [];
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
		const { extendSingleton = true } = options;
		const resolvedTarget = resolveThemeVariableTarget(target);
		this.lastTarget = resolvedTarget;

		const variables = buildRawThemeVariables(parsed);
		this.appliedVarKeys = applyThemeVariables(
			variables,
			target,
			this.appliedVarKeys,
		);

		const cssText = buildRawThemeStylesheet(parsed);
		if (cssText.length > 0) {
			injectStylesheet(this.styleElementId, cssText);
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
		removeStylesheet(this.styleElementId);
	}
}
