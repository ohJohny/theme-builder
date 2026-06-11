import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
	DEFAULT_THEME_CONFIG_PATH,
	LEGACY_THEME_CONFIG_PATH,
	resolveThemeConfigPath,
} from './resolveThemeConfigPath';

describe('resolveThemeConfigPath', () => {
	const dirs: string[] = [];

	afterEach(() => {
		for (const dir of dirs) {
			fs.rmSync(dir, { recursive: true, force: true });
		}
		dirs.length = 0;
		vi.restoreAllMocks();
	});

	function makeTempDir(): string {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-builder-'));
		dirs.push(dir);
		return dir;
	}

	it('defaults to theme.config.ts when present', () => {
		const cwd = makeTempDir();
		const primary = path.join(cwd, DEFAULT_THEME_CONFIG_PATH);
		fs.mkdirSync(path.dirname(primary), { recursive: true });
		fs.writeFileSync(primary, 'export const themeConfig = {};\n');

		expect(resolveThemeConfigPath(cwd)).toBe(primary);
	});

	it('falls back to legacy default-theme.ts with a warning', () => {
		const cwd = makeTempDir();
		const legacy = path.join(cwd, LEGACY_THEME_CONFIG_PATH);
		fs.mkdirSync(path.dirname(legacy), { recursive: true });
		fs.writeFileSync(legacy, 'export const themeConfig = {};\n');
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

		expect(resolveThemeConfigPath(cwd)).toBe(legacy);
		expect(warn).toHaveBeenCalled();
	});
});
