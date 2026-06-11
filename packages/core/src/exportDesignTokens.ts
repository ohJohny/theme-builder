import type { ThemeConfigInput } from './config/types';

export type DesignTokensDocument = {
	$schema?: string;
	[tokenPath: string]: unknown;
};

/** Export theme config tokens as W3C Design Tokens Community Group JSON. */
export function exportDesignTokens(config: ThemeConfigInput): DesignTokensDocument {
	const tokens: Record<string, unknown> = {
		$schema: 'https://design-tokens.github.io/community-group/format/',
	};

	if (config.colors?.base) {
		for (const [name, value] of Object.entries(config.colors.base)) {
			tokens[`color.base.${name}`] = { $type: 'color', $value: value };
		}
	}

	if (config.colors?.semantic) {
		for (const [name, value] of Object.entries(config.colors.semantic)) {
			if (typeof value === 'string') {
				tokens[`color.semantic.${name}`] = { $type: 'color', $value: value };
			} else {
				for (const [scheme, schemeValue] of Object.entries(value)) {
					tokens[`color.semantic.${name}.${scheme}`] = {
						$type: 'color',
						$value: schemeValue,
					};
				}
			}
		}
	}

	if (config.spacing) {
		for (const [name, value] of Object.entries(config.spacing)) {
			tokens[`spacing.${name}`] = { $type: 'dimension', $value: value };
		}
	}

	if (config.radius) {
		for (const [name, value] of Object.entries(config.radius)) {
			tokens[`radius.${name}`] = { $type: 'dimension', $value: value };
		}
	}

	if (config.fonts?.size) {
		for (const [name, value] of Object.entries(config.fonts.size)) {
			tokens[`font.size.${name}`] = { $type: 'dimension', $value: value };
		}
	}

	if (config.motion?.duration) {
		for (const [name, value] of Object.entries(config.motion.duration)) {
			tokens[`motion.duration.${name}`] = { $type: 'duration', $value: value };
		}
	}

	if (config.motion?.easing) {
		for (const [name, value] of Object.entries(config.motion.easing)) {
			tokens[`motion.easing.${name}`] = { $type: 'cubicBezier', $value: value };
		}
	}

	return tokens as DesignTokensDocument;
}
