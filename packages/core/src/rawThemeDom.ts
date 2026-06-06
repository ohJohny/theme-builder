import {
	colorBackgroundClass,
	colorForegroundClass,
	colorVarName,
	colorVarRef,
	displayUtilityClass,
	fontFamilyUtilityClass,
	fontFamilyVarName,
	fontFamilyVarRef,
	fontSizeUtilityClass,
	fontSizeVarName,
	fontSizeVarRef,
	fontWeightUtilityClass,
	fontWeightVarName,
	fontWeightVarRef,
	gapUtilityClass,
	iconUtilityClass,
	iconVarName,
	iconVarRef,
	lineHeightUtilityClass,
	lineHeightVarName,
	lineHeightVarRef,
	shadowUtilityClass,
	shadowVarName,
	shadowVarRef,
	spaceVarName,
	spaceVarRef,
	spacingUtilityClass,
} from './utils/theme-token-spec';

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
			variables[colorVarName(name)] = value;
		}
	}

	const spaceSources = [config.spacing, config.gap] as const;

	for (const source of spaceSources) {
		if (!source) continue;
		for (const [name, value] of Object.entries(source)) {
			variables[spaceVarName(name)] = value;
		}
	}

	if (config.fonts?.size) {
		for (const [name, value] of Object.entries(config.fonts.size)) {
			variables[fontSizeVarName(name)] = value;
		}
	}

	if (config.fonts?.weight) {
		for (const [name, value] of Object.entries(config.fonts.weight)) {
			variables[fontWeightVarName(name)] = value;
		}
	}

	if (config.fonts?.lineHeight) {
		for (const [name, value] of Object.entries(config.fonts.lineHeight)) {
			variables[lineHeightVarName(name)] = value;
		}
	}

	if (config.fonts?.family) {
		for (const [name, value] of Object.entries(config.fonts.family)) {
			variables[fontFamilyVarName(name)] = value;
		}
	}

	if (config.shadow) {
		for (const [name, value] of Object.entries(config.shadow)) {
			variables[shadowVarName(name)] = value;
		}
	}

	if (config.icon) {
		for (const [name, value] of Object.entries(config.icon)) {
			variables[iconVarName(name)] = value;
		}
	}

	return variables;
}

export function buildRawThemeStylesheet(config: RawThemeConfig): string {
	const rules: string[] = [];

	if (config.colors) {
		for (const name of Object.keys(config.colors)) {
			const varRef = colorVarRef(name);
			rules.push(`.${colorForegroundClass(name)}{color:${varRef}}`);
			rules.push(`.${colorBackgroundClass(name)}{background-color:${varRef}}`);
		}
	}

	if (config.spacing) {
		for (const name of Object.keys(config.spacing)) {
			const varRef = spaceVarRef(name);
			for (const prefix of SPACING_PREFIXES) {
				rules.push(
					`.${spacingUtilityClass(prefix, name)}{${spacingDeclarationsForPrefix(prefix, varRef)}}`,
				);
			}
		}
	}

	if (config.gap) {
		for (const name of Object.keys(config.gap)) {
			rules.push(`.${gapUtilityClass(name)}{gap:${spaceVarRef(name)}}`);
		}
	}

	if (config.fonts?.size) {
		for (const name of Object.keys(config.fonts.size)) {
			rules.push(
				`.${fontSizeUtilityClass(name)}{font-size:${fontSizeVarRef(name)}}`,
			);
		}
	}

	if (config.fonts?.weight) {
		for (const name of Object.keys(config.fonts.weight)) {
			rules.push(
				`.${fontWeightUtilityClass(name)}{font-weight:${fontWeightVarRef(name)}}`,
			);
		}
	}

	if (config.fonts?.lineHeight) {
		for (const name of Object.keys(config.fonts.lineHeight)) {
			rules.push(
				`.${lineHeightUtilityClass(name)}{line-height:${lineHeightVarRef(name)}}`,
			);
		}
	}

	if (config.fonts?.family) {
		for (const name of Object.keys(config.fonts.family)) {
			rules.push(
				`.${fontFamilyUtilityClass(name)}{font-family:${fontFamilyVarRef(name)}}`,
			);
		}
	}

	if (config.shadow) {
		for (const name of Object.keys(config.shadow)) {
			rules.push(
				`.${shadowUtilityClass(name)}{box-shadow:${shadowVarRef(name)}}`,
			);
		}
	}

	if (config.icon) {
		for (const name of Object.keys(config.icon)) {
			rules.push(
				`.${iconUtilityClass(name)}{width:${iconVarRef(name)};height:${iconVarRef(name)}}`,
			);
		}
	}

	if (config.display) {
		for (const [name, keyword] of Object.entries(config.display)) {
			rules.push(`.${displayUtilityClass(name)}{display:${keyword}}`);
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
