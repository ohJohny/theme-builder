import { isPlainObject } from '../utils/isPlainObject';
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
} from '../utils/theme-token-spec';
import {
	SPACING_PREFIXES,
	SPACING_PREFIX_CSS_PROPERTY,
	type SpacingPrefix,
} from '../types/theme.js';
import {
	expandLogicalAxisDeclarationCss,
	isLogicalAxisProperty,
} from '../types/logical-axis-expand.js';
import type { ColorValue, ThemeConfigInput } from './types';

export type BuildThemeStylesheetOptions = {
	readonly defaultScheme: string;
	readonly schemes: readonly string[];
};

function isSchemeVaryingColor(value: ColorValue): value is Readonly<Record<string, string>> {
	return isPlainObject(value);
}

function formatBlock(
	selector: string,
	variables: Record<string, string>,
	properties: Record<string, string> = {},
): string {
	const entries = [
		...Object.entries(properties),
		...Object.entries(variables),
	];
	if (entries.length === 0) return '';
	const body = entries.map(([name, value]) => `\t${name}:${value};`).join('\n');
	return `${selector}{\n${body}\n}`;
}

function collectRootProperties(config: ThemeConfigInput): Record<string, string> {
	const properties: Record<string, string> = {};
	if (config.remBase !== undefined) {
		properties['font-size'] = config.remBase;
	}
	return properties;
}

function collectInvariantVariables(config: ThemeConfigInput): Record<string, string> {
	const variables: Record<string, string> = {};

	if (config.colors?.base) {
		for (const [name, value] of Object.entries(config.colors.base)) {
			variables[colorVarName(name)] = value;
		}
	}

	if (config.colors?.semantic) {
		for (const [name, value] of Object.entries(config.colors.semantic)) {
			if (!isSchemeVaryingColor(value)) {
				variables[colorVarName(name)] = value;
			}
		}
	}

	if (config.spacing) {
		for (const [name, value] of Object.entries(config.spacing)) {
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

function collectSchemeVariables(
	config: ThemeConfigInput,
	scheme: string,
): Record<string, string> {
	const variables: Record<string, string> = {};
	if (!config.colors?.semantic) return variables;

	for (const [name, value] of Object.entries(config.colors.semantic)) {
		if (isSchemeVaryingColor(value) && value[scheme] !== undefined) {
			variables[colorVarName(name)] = value[scheme];
		}
	}
	return variables;
}

function buildUtilityRules(config: ThemeConfigInput): string[] {
	const rules: string[] = [];

	if (config.colors?.base) {
		for (const name of Object.keys(config.colors.base)) {
			const varRef = colorVarRef(name);
			rules.push(`.${colorForegroundClass(name)}{color:${varRef}}`);
			rules.push(`.${colorBackgroundClass(name)}{background-color:${varRef}}`);
		}
	}

	if (config.colors?.semantic) {
		for (const name of Object.keys(config.colors.semantic)) {
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
			rules.push(`.${gapUtilityClass(name)}{gap:${varRef}}`);
		}
	}

	if (config.fonts?.size) {
		for (const name of Object.keys(config.fonts.size)) {
			rules.push(`.${fontSizeUtilityClass(name)}{font-size:${fontSizeVarRef(name)}}`);
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
			rules.push(`.${shadowUtilityClass(name)}{box-shadow:${shadowVarRef(name)}}`);
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

	return rules;
}

function spacingDeclarationsForPrefix(prefix: SpacingPrefix, value: string): string {
	const prop = SPACING_PREFIX_CSS_PROPERTY[prefix];
	if (isLogicalAxisProperty(prop)) {
		return expandLogicalAxisDeclarationCss(prop, value);
	}
	return `${prop}:${value}`;
}

export function buildThemeStylesheet(
	config: ThemeConfigInput,
	options: BuildThemeStylesheetOptions,
): string {
	const blocks: string[] = [];
	const invariant = collectInvariantVariables(config);
	const defaultSchemeVars = collectSchemeVariables(config, options.defaultScheme);
	const rootProperties = collectRootProperties(config);

	blocks.push(
		formatBlock(
			':root',
			{
				...invariant,
				...defaultSchemeVars,
			},
			rootProperties,
		),
	);

	for (const scheme of options.schemes) {
		const schemeVars = collectSchemeVariables(config, scheme);
		if (Object.keys(schemeVars).length === 0) continue;
		if (scheme === options.defaultScheme) {
			blocks.push(formatBlock(`:root,[data-theme="${scheme}"]`, schemeVars));
		} else {
			blocks.push(formatBlock(`[data-theme="${scheme}"]`, schemeVars));
		}
	}

	return [...blocks.filter(Boolean), ...buildUtilityRules(config)].join('\n');
}

export function resolveSchemes(config: ThemeConfigInput): readonly string[] {
	return config.schemes ?? ['light', 'dark'];
}

export function resolveDefaultScheme(
	config: ThemeConfigInput,
	override?: string,
): string {
	const schemes = resolveSchemes(config);
	if (override !== undefined) {
		if (!schemes.includes(override)) {
			throw new Error(
				`[createTheme] defaultScheme "${override}" is not in schemes [${schemes.join(', ')}]`,
			);
		}
		return override;
	}
	return schemes[0] ?? 'light';
}
