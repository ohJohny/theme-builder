import { isPlainObject } from './isPlainObject';
import type { CustomClassCssProperties, ThemeConfigInput } from '../config/types';

export const CUSTOM_CLASS_DEFAULT_PREFIX = 'tb';

export const CUSTOM_CLASS_META_KEYS = ['withPrefix', 'prefix'] as const;

export type CustomClassOptions = {
	readonly withPrefix: boolean;
	readonly prefix: string;
};

export type CustomClassEntry = {
	readonly name: string;
	readonly properties: CustomClassCssProperties;
};

const CUSTOM_CLASS_NAME_PATTERN = /^[a-zA-Z_][\w-]*$/;

export function isCustomClassMetaKey(key: string): boolean {
	return (CUSTOM_CLASS_META_KEYS as readonly string[]).includes(key);
}

export function isValidCustomClassName(name: string): boolean {
	return name.length > 0 && CUSTOM_CLASS_NAME_PATTERN.test(name);
}

export function resolveCustomClassOptions(
	classes: ThemeConfigInput['classes'] | undefined,
): CustomClassOptions {
	return {
		withPrefix: classes?.withPrefix ?? true,
		prefix: classes?.prefix ?? CUSTOM_CLASS_DEFAULT_PREFIX,
	};
}

export function resolveCustomClassName(name: string, options: CustomClassOptions): string {
	if (!options.withPrefix) {
		return name;
	}
	return `${options.prefix}-${name}`;
}

export function collectCustomClassEntries(config: ThemeConfigInput): readonly CustomClassEntry[] {
	if (!config.classes) return [];

	const entries: CustomClassEntry[] = [];
	for (const [name, value] of Object.entries(config.classes)) {
		if (isCustomClassMetaKey(name)) continue;
		if (!isPlainObject(value)) continue;
		entries.push({
			name,
			properties: value as CustomClassCssProperties,
		});
	}
	return entries;
}

function camelToKebab(property: string): string {
	return property.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

export function cssPropertiesToDeclarations(properties: CustomClassCssProperties): string {
	return Object.entries(properties)
		.map(([key, value]) => `${camelToKebab(key)}:${String(value)}`)
		.join(';');
}

export function buildCustomClassRule(className: string, properties: CustomClassCssProperties): string {
	const declarations = cssPropertiesToDeclarations(properties);
	return `.${className}{${declarations}}`;
}
