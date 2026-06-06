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
	spacing: {
		zero: '0px',
		smallest: '4px',
		tiny: '6px',
		xs: '8px',
		sm: '12px',
		md: '16px',
		mdl: '20px',
		lg: '24px',
		xl: '32px',
		xxl: '40px',
		giant: '48px',
	},
	fonts: {
		family: {
			sans: 'Inter, system-ui, sans-serif',
			mono: 'ui-monospace, monospace',
		},
		size: {
			xs: '12px',
			xsplus: '13px',
			sm: '14px',
			md: '16px',
			lg: '18px',
			xl: '20px',
			xxl: '24px',
			giant: '48px',
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
		sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
		md: '0 0.25rem 1.5rem rgba(0, 0, 0, 0.08), 0 0.75rem 2.5rem rgba(0, 0, 0, 0.06)',
		lg: '0 0.5rem 2rem rgba(0, 0, 0, 0.1), 0 1rem 3rem rgba(0, 0, 0, 0.08)',
	},
	icon: {
		xs: '14px',
		sm: '16px',
		md: '20px',
		lg: '24px',
		xl: '32px',
	},
	display: {
		flex: 'flex',
		grid: 'grid',
		block: 'block',
		none: 'none',
	},
	breakpoints: {
		mobile: { max: '767px' },
		tablet: { min: '768px', max: '1023px' },
		desktop: { min: '1024px' },
	},
};

export const defaultThemeJson = JSON.stringify(demoThemeConfigInput, null, '\t');
