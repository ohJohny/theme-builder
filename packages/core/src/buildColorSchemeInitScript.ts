import { SYSTEM_COLOR_SCHEME } from './colorScheme.types';
import type { ColorSchemeId, ThemeStorageConfig } from './colorScheme.types';
import { escapeCookieName } from './parseCookieValue';

export type BuildColorSchemeInitScriptOptions = {
	readonly schemes: readonly string[];
	readonly defaultScheme: ColorSchemeId;
	readonly storage: ThemeStorageConfig;
	readonly includeSystemScheme?: boolean;
};

function buildStorageReadExpression(storage: ThemeStorageConfig): string {
	if (storage.type === 'localStorage') {
		return `try{stored=localStorage.getItem(${JSON.stringify(storage.key)})}catch(e){}`;
	}
	const escapedKey = escapeCookieName(storage.key);
	return `try{var m=document.cookie.match(new RegExp("(?:^|; )${escapedKey}=([^;]*)"));if(m)stored=decodeURIComponent(m[1])}catch(e){}`;
}

/** Generates a blocking IIFE for `<head>` that sets `data-theme` before first paint. */
export function buildColorSchemeInitScript(options: BuildColorSchemeInitScriptOptions): string {
	const schemesJson = JSON.stringify([...options.schemes]);
	const defaultSchemeJson = JSON.stringify(options.defaultScheme);
	const storageRead = buildStorageReadExpression(options.storage);

	const includeSystem = options.includeSystemScheme ?? true;
	const systemToken = JSON.stringify(SYSTEM_COLOR_SCHEME);
	const resolveSystem =
		'var prefersDark=false;try{prefersDark=window.matchMedia("(prefers-color-scheme: dark)").matches}catch(e){}if(prefersDark&&schemes.indexOf("dark")!==-1)return"dark";if(!prefersDark&&schemes.indexOf("light")!==-1)return"light";return schemes[0]||"light"';
	const isValidStored = includeSystem
		? `stored===${systemToken}||schemes.indexOf(stored)!==-1`
		: 'schemes.indexOf(stored)!==-1';
	const resolveApplied = `function resolveApplied(pref){if(pref===${systemToken}){${resolveSystem}}return pref}var preference=defaultScheme;if(stored&&(${isValidStored})){preference=stored}else if(preference!==${systemToken}&&schemes.indexOf(preference)===-1){preference=schemes[0]||"light"}var scheme=resolveApplied(preference)`;

	return `(function(){var schemes=${schemesJson};var defaultScheme=${defaultSchemeJson};var stored=null;${storageRead};${resolveApplied};document.documentElement.setAttribute("data-theme",scheme)})();`;
}

/** HTML snippet for copy-paste into a layout `<head>`. */
export function buildColorSchemeInitScriptHtmlSnippet(scriptSrc: string): string {
	return `<script src="${scriptSrc}"></script>`;
}
