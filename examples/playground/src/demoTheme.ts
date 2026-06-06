import type { ThemeConfigInput } from '@ohJohny/theme-builder/core';

export const demoThemeConfigInput: ThemeConfigInput = {
	schemes: ['light', 'dark', 'sepia'],
	colors: {
		base: {
			white: '#ffffff',
			black: '#0f0f0f',
		},
		semantic: {
			'text-primary': {
				light: '#111827',
				dark: '#f3f4f6',
				sepia: '#3d2b1f',
			},
			'text-secondary': {
				light: '#4b5563',
				dark: '#d1d5db',
				sepia: '#5c4a3a',
			},
			'text-tertiary': {
				light: '#9ca3af',
				dark: '#9ca3af',
				sepia: '#8a735f',
			},
			'surface-main': {
				light: '#f9fafb',
				dark: '#111827',
				sepia: '#f4ecd8',
			},
			'surface-container': {
				light: '#ffffff',
				dark: '#1f2937',
				sepia: '#faf6eb',
			},
			'surface-sidebar': {
				light: '#f3f4f6',
				dark: '#374151',
				sepia: '#ebe3cf',
			},
			'border-default': {
				light: '#e5e7eb',
				dark: '#4b5563',
				sepia: '#d4c4a8',
			},
			'body-default': {
				light: '#f3f4f6',
				dark: '#1f2937',
				sepia: '#efe5ce',
			},
			'action-primary-default': {
				light: '#2563eb',
				dark: '#3b82f6',
				sepia: '#8b6914',
			},
			'action-primary-hover': {
				light: '#1d4ed8',
				dark: '#2563eb',
				sepia: '#735610',
			},
		},
	},
	remBase: '16px',
	spacing: {
		zero: '0',
		smallest: '0.25rem',
		tiny: '0.375rem',
		xs: '0.5rem',
		sm: '0.75rem',
		md: '1rem',
		mdl: '1.25rem',
		lg: '1.5rem',
		xl: '2rem',
		xxl: '2.5rem',
		giant: '3rem',
	},
	fonts: {
		family: {
			sans: 'Inter, system-ui, sans-serif',
			mono: 'ui-monospace, monospace',
		},
		size: {
			xs: '0.75rem',
			xsplus: '0.8125rem',
			sm: '0.875rem',
			md: '1rem',
			lg: '1.125rem',
			xl: '1.25rem',
			xxl: '1.5rem',
			giant: '3rem',
		},
		weight: {
			'300': '300',
			'400': '400',
			'500': '500',
			'600': '600',
			'700': '700',
			'800': '800',
		},
		lineHeight: {
			'100': '1',
			'125': '1.25',
			'150': '1.5',
			'175': '1.75',
			'200': '2',
		},
	},
	shadow: {
		sm: '0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.08)',
		md: '0 0.25rem 1.5rem rgba(0, 0, 0, 0.08), 0 0.75rem 2.5rem rgba(0, 0, 0, 0.06)',
		lg: '0 0.5rem 2rem rgba(0, 0, 0, 0.1), 0 1rem 3rem rgba(0, 0, 0, 0.08)',
	},
	icon: {
		xs: '0.875rem',
		sm: '1rem',
		md: '1.25rem',
		lg: '1.5rem',
		xl: '2rem',
	},
	display: {
		flex: 'flex',
		grid: 'grid',
		block: 'block',
		none: 'none',
	},
	breakpoints: {
		mobile: { max: '47.9375rem' },
		tablet: { min: '48rem', max: '63.9375rem' },
		desktop: { min: '64rem' },
	},
};

export const defaultThemeJson = JSON.stringify(demoThemeConfigInput, null, '\t');
