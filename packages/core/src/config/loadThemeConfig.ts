import { pathToFileURL } from 'node:url';

import type { ColorSchemeInitScriptOptions } from './generateThemeArtifacts.js';
import type { GenerateThemeArtifactsOptions } from './generateThemeArtifacts.js';
import type { ThemeConfigInput } from './types.js';

export type ThemeConfigModule = {
	readonly themeConfig?: ThemeConfigInput;
	readonly themeHashedOptions?: Partial<
		Pick<
			GenerateThemeArtifactsOptions,
			'utilityClassHashSalt' | 'utilityClassHashPrefix' | 'defaultScheme'
		>
	>;
	readonly themeInitOptions?: ColorSchemeInitScriptOptions;
};

let tsxRegistered = false;

async function importTsxRegister(): Promise<(options?: object) => void> {
	try {
		const mod = await import('tsx/esm/api');
		return mod.register;
	} catch {
		throw new Error(
			'Theme config is TypeScript (.ts/.mts/.cts); install tsx as a dev dependency or use a compiled .js config module.',
		);
	}
}

function ensureTsxRegistered(register: (options?: object) => void): void {
	if (!tsxRegistered) {
		register();
		tsxRegistered = true;
	}
}

export async function loadThemeConfigModule(configPath: string): Promise<ThemeConfigModule> {
	const resolved = pathToFileURL(configPath).href;
	const needsTsx = /\.(?:cts|mts|ts)$/.test(configPath);
	if (needsTsx) {
		const register = await importTsxRegister();
		ensureTsxRegistered(register);
	}
	const mod = (await import(resolved)) as ThemeConfigModule;
	return mod;
}

/** @internal Resets tsx registration between tests. */
export function resetTsxRegistrationForTests(): void {
	tsxRegistered = false;
}
