import type { RawThemeConfig } from '@ohJohny/theme-builder/core';
import {
	DISPLAY_KEYWORDS,
	FONT_SIZE_SCALE,
	ICON_SIZE_SCALE,
	LINE_HEIGHT_STEPS,
	SHADOW_SCALE,
	SPACING_SCALE,
	SPACING_SIZE_NAMES,
} from '@ohJohny/theme-builder/core';

function pxEntries(
	scale: Readonly<Record<string, number>>,
): Record<string, string> {
	return Object.fromEntries(
		Object.entries(scale).map(([name, n]) => [name, `${n}px`]),
	);
}

const spacing = pxEntries(SPACING_SCALE);

export const demoThemeConfig: RawThemeConfig = {
	colors: {
		white: '#ffffff',
		black: '#0f0f0f',
		'text-primary': '#111827',
		'text-secondary': '#4b5563',
		'text-tertiary': '#9ca3af',
		'surface-main': '#f9fafb',
		'surface-container': '#ffffff',
		'surface-sidebar': '#f3f4f6',
		'border-default': '#e5e7eb',
		'body-default': '#f3f4f6',
		'action-primary-default': '#2563eb',
		'action-primary-hover': '#1d4ed8',
	},
	spacing,
	gap: spacing,
	fonts: {
		family: {
			sans: 'Inter, system-ui, sans-serif',
			mono: 'ui-monospace, monospace',
		},
		size: pxEntries(FONT_SIZE_SCALE),
		weight: {
			'300': '300',
			'400': '400',
			'500': '500',
			'600': '600',
			'700': '700',
			'800': '800',
		},
		lineHeight: Object.fromEntries(
			LINE_HEIGHT_STEPS.map((step) => [String(step), String(step / 100)]),
		),
	},
	shadow: { ...SHADOW_SCALE },
	icon: pxEntries(ICON_SIZE_SCALE),
	display: Object.fromEntries(DISPLAY_KEYWORDS.map((k) => [k, k])),
};

/** Ensures every spacing size name exists in the config. */
export const spacingSizeNames = [...SPACING_SIZE_NAMES];
