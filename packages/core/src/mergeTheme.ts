import type { ColorTokenPair, IconSizeToken, Theme, TokenClass } from './types/theme.js';
import { isPlainObject } from './utils/isPlainObject';

export type DeepPartial<T> = T extends object
	? { readonly [P in keyof T]?: DeepPartial<T[P]> }
	: T;

export type ThemeExtension = DeepPartial<Theme>;

function isTokenClass(value: unknown): value is TokenClass {
	return (
		isPlainObject(value) &&
		typeof value.class === 'string' &&
		typeof value.value === 'string' &&
		!('foreground' in value)
	);
}

function isIconSizeToken(value: unknown): value is IconSizeToken {
	if (!isPlainObject(value)) return false;
	return (
		typeof value.class === 'string' &&
		typeof value.value === 'string' &&
		typeof value.px === 'number'
	);
}

function isColorTokenPair(value: unknown): value is ColorTokenPair {
	if (!isPlainObject(value)) return false;
	const fg = value.foreground;
	const bg = value.background;
	return isTokenClass(fg) && isTokenClass(bg);
}

function isMergeLeaf(value: unknown): boolean {
	return isTokenClass(value) || isIconSizeToken(value) || isColorTokenPair(value);
}

function mergeRecords<T extends Record<string, unknown>>(
	base: T,
	extension: Readonly<Record<string, unknown>> | undefined,
): T {
	if (extension === undefined) return base;
	const merged = { ...base } as Record<string, unknown>;
	for (const [key, value] of Object.entries(extension)) {
		if (value === undefined) continue;
		const existing = merged[key];
		if (isPlainObject(existing) && isPlainObject(value) && !isMergeLeaf(value)) {
			merged[key] = mergeValue(existing, value);
		} else {
			merged[key] = value;
		}
	}
	return merged as T;
}

function mergeValue(base: unknown, extension: unknown): unknown {
	if (extension === undefined) return base;
	if (isMergeLeaf(extension)) return extension;
	if (!isPlainObject(base) || !isPlainObject(extension)) return extension;

	return mergeRecords(
		base as Record<string, unknown>,
		extension as Record<string, unknown>,
	);
}

/** Deep-merges theme extensions after `base`; extension leaves replace preset leaves. */
export function mergeTheme(base: Theme, ...extensions: readonly ThemeExtension[]): Theme {
	let result: Theme = base;

	for (const extension of extensions) {
		if (extension === undefined) continue;

		const next: Record<string, unknown> = { ...result };

		for (const key of Object.keys(extension) as (keyof Theme)[]) {
			const extValue = extension[key];
			if (extValue === undefined) continue;

			const baseValue = result[key];

			if (key === 'colorUtilities' && isPlainObject(baseValue) && isPlainObject(extValue)) {
				const baseCu = baseValue as unknown as Theme['colorUtilities'];
				const extCu = extValue as ThemeExtension['colorUtilities'];
				next.colorUtilities = {
					base: {
						tokens: mergeRecords(
							baseCu.base.tokens as Record<string, ColorTokenPair>,
							extCu?.base?.tokens as Record<string, ColorTokenPair> | undefined,
						),
					},
					semantic: {
						tokens: mergeRecords(
							baseCu.semantic.tokens as Record<string, ColorTokenPair>,
							extCu?.semantic?.tokens as Record<string, ColorTokenPair> | undefined,
						),
					},
				};
				continue;
			}

			next[key as string] = mergeValue(baseValue, extValue);
		}

		result = next as unknown as Theme;
	}

	return result;
}
