import { SPACING_PREFIXES, type SpacingPrefix } from '../types/theme.js';

export function colorVarName(name: string): string {
	return `--color-${name}`;
}

export function colorVarRef(name: string): string {
	return `var(${colorVarName(name)})`;
}

export function colorForegroundClass(name: string): string {
	return `color-${name}`;
}

export function colorBackgroundClass(name: string): string {
	return `bg-${name}`;
}

export function colorUtilityClasses(name: string): {
	readonly foreground: string;
	readonly background: string;
} {
	return {
		foreground: colorForegroundClass(name),
		background: colorBackgroundClass(name),
	};
}

export function spaceVarName(name: string): string {
	return `--space-${name}`;
}

export function spaceVarRef(name: string): string {
	return `var(${spaceVarName(name)})`;
}

export function spacingUtilityClass(prefix: SpacingPrefix, name: string): string {
	return `${prefix}-${name}`;
}

export function gapUtilityClass(name: string): string {
	return `gap-${name}`;
}

export function fontFamilyVarName(name: string): string {
	return `--font-family-${name}`;
}

export function fontFamilyVarRef(name: string): string {
	return `var(${fontFamilyVarName(name)})`;
}

export function fontFamilyUtilityClass(name: string): string {
	return `font-${name}`;
}

export function fontSizeVarName(name: string): string {
	return `--font-size-${name}`;
}

export function fontSizeVarRef(name: string): string {
	return `var(${fontSizeVarName(name)})`;
}

export function fontSizeUtilityClass(name: string): string {
	return `text-${name}`;
}

export function fontWeightVarName(step: string | number): string {
	return `--font-weight-${step}`;
}

export function fontWeightVarRef(step: string | number): string {
	return `var(${fontWeightVarName(step)})`;
}

export function fontWeightUtilityClass(step: string | number): string {
	return `font-weight-${step}`;
}

export function lineHeightVarName(step: string | number): string {
	return `--lh-${step}`;
}

export function lineHeightVarRef(step: string | number): string {
	return `var(${lineHeightVarName(step)})`;
}

export function lineHeightUtilityClass(step: string | number): string {
	return `lh-${step}`;
}

export function shadowVarName(name: string): string {
	return `--shadow-${name}`;
}

export function shadowVarRef(name: string): string {
	return `var(${shadowVarName(name)})`;
}

export function shadowUtilityClass(name: string): string {
	return `shadow-${name}`;
}

export function radiusVarName(name: string): string {
	return `--radius-${name}`;
}

export function radiusVarRef(name: string): string {
	return `var(${radiusVarName(name)})`;
}

export function radiusUtilityClass(name: string): string {
	return `rounded-${name}`;
}

export function motionDurationVarName(name: string): string {
	return `--motion-duration-${name}`;
}

export function motionDurationVarRef(name: string): string {
	return `var(${motionDurationVarName(name)})`;
}

export function motionDurationUtilityClass(name: string): string {
	return `duration-${name}`;
}

export function motionEasingVarName(name: string): string {
	return `--motion-easing-${name}`;
}

export function motionEasingVarRef(name: string): string {
	return `var(${motionEasingVarName(name)})`;
}

export function opacityVarName(name: string): string {
	return `--opacity-${name}`;
}

export function opacityVarRef(name: string): string {
	return `var(${opacityVarName(name)})`;
}

export function opacityUtilityClass(name: string): string {
	return `opacity-${name}`;
}

export function zIndexVarName(name: string): string {
	return `--z-index-${name}`;
}

export function zIndexVarRef(name: string): string {
	return `var(${zIndexVarName(name)})`;
}

export function zIndexUtilityClass(name: string): string {
	return `z-${name}`;
}

export function iconVarName(name: string): string {
	return `--icon-size-${name}`;
}

export function iconVarRef(name: string): string {
	return `var(${iconVarName(name)})`;
}

export function iconUtilityClass(name: string): string {
	return `icon-${name}`;
}

export function displayUtilityClass(name: string): string {
	return `d-${name}`;
}

export const REM_BASE_VAR_NAME = '--rem-base';

export const DEFAULT_REM_BASE = '16px';

export function remBaseVarRef(): string {
	return `var(${REM_BASE_VAR_NAME})`;
}

export { SPACING_PREFIXES };
