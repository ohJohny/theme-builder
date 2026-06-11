import fs from 'node:fs';
import path from 'node:path';

export const DEFAULT_THEME_CONFIG_PATH = 'src/theme/theme.config.ts';
export const LEGACY_THEME_CONFIG_PATH = 'src/theme/default-theme.ts';

export function resolveThemeConfigPath(cwd: string, configPath?: string): string {
	if (configPath !== undefined) {
		return path.isAbsolute(configPath) ? configPath : path.resolve(cwd, configPath);
	}

	const primary = path.resolve(cwd, DEFAULT_THEME_CONFIG_PATH);
	if (fs.existsSync(primary)) {
		return primary;
	}

	const legacy = path.resolve(cwd, LEGACY_THEME_CONFIG_PATH);
	if (fs.existsSync(legacy)) {
		console.warn(
			`[theme-builder] ${LEGACY_THEME_CONFIG_PATH} is deprecated; rename to ${DEFAULT_THEME_CONFIG_PATH}`,
		);
		return legacy;
	}

	return primary;
}
