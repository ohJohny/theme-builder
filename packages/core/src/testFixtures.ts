import { createTheme } from './config/createTheme';
import { defineThemeConfig } from './config/defineThemeConfig';
import type { CreatedTheme } from './config/types';

export const testThemeConfig = defineThemeConfig({
	schemes: ['light', 'dark'] as const,
	colors: {
		base: { white: '#fff', black: '#000' },
		semantic: {
			'text-primary': { light: '#111', dark: '#eee' },
			'surface-main': { light: '#f5f5f5', dark: '#111' },
		},
	},
	remBase: '16px',
	spacing: { sm: '8px', md: '16px' },
	fonts: {
		family: { sans: 'sans-serif' },
		size: { sm: '14px', md: '16px' },
		weight: { '400': '400', '600': '600' },
		lineHeight: { '150': '1.5' },
	},
	shadow: { md: '0 2px 4px rgba(0,0,0,.1)' },
	icon: { sm: '16px' },
	display: { flex: 'flex', block: 'block' },
	classes: {
		card: {
			padding: 'var(--space-md)',
			borderRadius: '8px',
			backgroundColor: 'var(--color-surface-main)',
		},
	},
});

export function createTestTheme(): CreatedTheme<typeof testThemeConfig> {
	return createTheme(testThemeConfig, { mode: 'identity' });
}
