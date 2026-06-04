import {
	SPACING_PREFIXES,
	SPACING_PREFIX_CSS_PROPERTY,
	type SpacingPrefix,
} from './types/theme.js';
import {
	expandLogicalAxisDeclarationCss,
	isLogicalAxisProperty,
} from './types/logical-axis-expand.js';

import type { RawThemeConfig } from './rawThemeConfig';

export function buildRawThemeVariables(config: RawThemeConfig): Record<string, string> {
	const variables: Record<string, string> = {};

	if (config.colors) {
		for (const [name, value] of Object.entries(config.colors)) {
			variables[`--color-${name}`] = value;
		}
	}

	const spaceSources = [
		config.spacing,
		config.gap,
	] as const;

	for (const source of spaceSources) {
		if (!source) continue;
		for (const [name, value] of Object.entries(source)) {
			variables[`--space-${name}`] = value;
		}
	}

	if (config.fonts?.size) {
		for (const [name, value] of Object.entries(config.fonts.size)) {
			variables[`--font-size-${name}`] = value;
		}
	}

	if (config.fonts?.weight) {
		for (const [name, value] of Object.entries(config.fonts.weight)) {
			variables[`--font-weight-${name}`] = value;
		}
	}

	if (config.fonts?.lineHeight) {
		for (const [name, value] of Object.entries(config.fonts.lineHeight)) {
			variables[`--lh-${name}`] = value;
		}
	}

	if (config.fonts?.family) {
		for (const [name, value] of Object.entries(config.fonts.family)) {
			variables[`--font-family-${name}`] = value;
		}
	}

	if (config.shadow) {
		for (const [name, value] of Object.entries(config.shadow)) {
			variables[`--shadow-${name}`] = value;
		}
	}

	if (config.icon) {
		for (const [name, value] of Object.entries(config.icon)) {
			variables[`--icon-size-${name}`] = value;
		}
	}

	return variables;
}

export function buildRawThemeStylesheet(config: RawThemeConfig): string {
	const rules: string[] = [];

	if (config.colors) {
		for (const name of Object.keys(config.colors)) {
			const varRef = `var(--color-${name})`;
			rules.push(`.color-${name}{color:${varRef}}`);
			rules.push(`.bg-${name}{background-color:${varRef}}`);
		}
	}

	if (config.spacing) {
		for (const name of Object.keys(config.spacing)) {
			const varRef = `var(--space-${name})`;
			for (const prefix of SPACING_PREFIXES) {
				rules.push(
					`.${prefix}-${name}{${spacingDeclarationsForPrefix(prefix, varRef)}}`,
				);
			}
		}
	}

	if (config.gap) {
		for (const name of Object.keys(config.gap)) {
			rules.push(`.gap-${name}{gap:var(--space-${name})}`);
		}
	}

	if (config.fonts?.size) {
		for (const name of Object.keys(config.fonts.size)) {
			rules.push(`.text-${name}{font-size:var(--font-size-${name})}`);
		}
	}

	if (config.fonts?.weight) {
		for (const name of Object.keys(config.fonts.weight)) {
			rules.push(`.font-weight-${name}{font-weight:var(--font-weight-${name})}`);
		}
	}

	if (config.fonts?.lineHeight) {
		for (const name of Object.keys(config.fonts.lineHeight)) {
			rules.push(`.lh-${name}{line-height:var(--lh-${name})}`);
		}
	}

	if (config.fonts?.family) {
		for (const name of Object.keys(config.fonts.family)) {
			rules.push(`.font-${name}{font-family:var(--font-family-${name})}`);
		}
	}

	if (config.shadow) {
		for (const name of Object.keys(config.shadow)) {
			rules.push(`.shadow-${name}{box-shadow:var(--shadow-${name})}`);
		}
	}

	if (config.icon) {
		for (const name of Object.keys(config.icon)) {
			rules.push(
				`.icon-${name}{width:var(--icon-size-${name});height:var(--icon-size-${name})}`,
			);
		}
	}

	if (config.display) {
		for (const [name, keyword] of Object.entries(config.display)) {
			rules.push(`.d-${name}{display:${keyword}}`);
		}
	}

	return rules.join('\n');
}

function spacingDeclarationsForPrefix(prefix: SpacingPrefix, value: string): string {
	const prop = SPACING_PREFIX_CSS_PROPERTY[prefix];
	if (isLogicalAxisProperty(prop)) {
		return expandLogicalAxisDeclarationCss(prop, value);
	}
	return `${prop}:${value}`;
}
