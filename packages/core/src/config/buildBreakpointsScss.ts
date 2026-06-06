import type { BreakpointValue, ThemeConfigInput } from './types';
import { formatRemCss } from '../utils/remLength.js';

function formatMediaQuery(value: BreakpointValue): string {
	const min = 'min' in value && value.min !== undefined ? formatRemCss(value.min) : undefined;
	const max = 'max' in value && value.max !== undefined ? formatRemCss(value.max) : undefined;

	if (min !== undefined && max !== undefined) {
		return `@media (min-width: ${min}) and (max-width: ${max})`;
	}
	if (min !== undefined) {
		return `@media (min-width: ${min})`;
	}
	if (max !== undefined) {
		return `@media (max-width: ${max})`;
	}
	throw new Error('[buildBreakpointsScss] breakpoint must define min and/or max');
}

export function buildBreakpointsScss(config: ThemeConfigInput): string | undefined {
	if (!config.breakpoints || Object.keys(config.breakpoints).length === 0) {
		return undefined;
	}

	const lines = ['/** Auto-generated — do not edit. */'];
	for (const [name, value] of Object.entries(config.breakpoints)) {
		const media = formatMediaQuery(value);
		lines.push(`@mixin ${name} { ${media} { @content; } }`);
	}
	return lines.join('\n');
}
