import { applyColorScheme } from '../applyColorScheme';
import { startColorSchemeViewTransition } from '../colorSchemeTransition';
import { applyAdditionalVariables } from '../applyAdditionalVariables';
import {
	DEFAULT_SCHEMES,
	SYSTEM_COLOR_SCHEME,
	SYSTEM_THEME_META,
	deriveThemeMeta,
	isColorSchemePreference,
	type ColorSchemeId,
	type ColorSchemePreference,
	type ThemeMetaItem,
	type ThemeStorageConfig,
} from '../colorScheme.types';
import { readRawStorageValue, writePersistedColorScheme } from '../colorSchemeStorage';
import { nextPreferenceInCycle, resolveAppliedColorScheme } from '../resolveAppliedColorScheme';
import { resolveColorSchemePreference } from '../resolveInitialColorScheme';

export type ColorSchemeListItem = ThemeMetaItem & {
	readonly active: boolean;
};

export type ColorSchemeStoreState = {
	/** User preference — may be `system`. */
	readonly colorScheme: ColorSchemePreference;
	/** Scheme applied to `data-theme`. */
	readonly resolvedColorScheme: ColorSchemeId;
	readonly colorSchemeList: readonly ColorSchemeListItem[];
	readonly labelShort: string;
};

export type ColorSchemeStoreOptions = {
	readonly schemes: readonly string[];
	readonly themeMeta?: readonly ThemeMetaItem[];
	readonly presetColorScheme?: ColorSchemePreference;
	readonly storage?: ThemeStorageConfig;
	readonly applyColorSchemeOnMount?: boolean;
	readonly additionalVariables?: Record<string, string>;
	/** When true (default), `system` is a valid preference and included in round-robin cycling. */
	readonly includeSystemScheme?: boolean;
	/** When true, scheme changes use `startColorSchemeViewTransition` (respects reduced motion). */
	readonly viewTransition?: boolean;
};

export type ColorSchemeStore = {
	readonly subscribe: (listener: () => void) => () => void;
	readonly getState: () => ColorSchemeStoreState;
	readonly changeColorScheme: (next?: ColorSchemePreference) => void;
	readonly dispose: () => void;
};

const PREFERS_COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

function buildThemeMetaList(
	schemes: readonly string[],
	themeMeta: readonly ThemeMetaItem[],
	includeSystemScheme: boolean,
): readonly ThemeMetaItem[] {
	if (!includeSystemScheme) {
		return themeMeta;
	}
	return [...themeMeta, SYSTEM_THEME_META];
}

export function createColorSchemeStore(options: ColorSchemeStoreOptions): ColorSchemeStore {
	const schemes = options.schemes.length > 0 ? options.schemes : DEFAULT_SCHEMES;
	const includeSystemScheme = options.includeSystemScheme ?? true;
	const themeMeta = buildThemeMetaList(
		schemes,
		options.themeMeta ?? deriveThemeMeta(schemes),
		includeSystemScheme,
	);
	const preset = options.presetColorScheme ?? schemes[0] ?? DEFAULT_SCHEMES[0];
	const applyOnMount = options.applyColorSchemeOnMount ?? true;
	const useViewTransition = options.viewTransition ?? false;

	const listeners = new Set<() => void>();
	const notify = () => {
		for (const listener of listeners) {
			listener();
		}
	};

	let colorScheme: ColorSchemePreference = schemes[0] ?? DEFAULT_SCHEMES[0];
	let resolvedColorScheme: ColorSchemeId = schemes[0] ?? DEFAULT_SCHEMES[0];
	let appliedVariableKeys: string[] = [];
	let cachedState: ColorSchemeStoreState | null = null;

	const applyVariables = () => {
		appliedVariableKeys = applyAdditionalVariables(options.additionalVariables, appliedVariableKeys);
	};

	const syncResolvedScheme = () => {
		resolvedColorScheme = resolveAppliedColorScheme(colorScheme, schemes);
	};

	const applyCurrentScheme = (animate = false) => {
		const apply = () => applyColorScheme(resolvedColorScheme);
		if (animate && useViewTransition) {
			startColorSchemeViewTransition(apply);
		} else {
			apply();
		}
	};

	const buildList = (): readonly ColorSchemeListItem[] =>
		themeMeta.map((item) => ({
			...item,
			active: item.id === colorScheme,
		}));

	const buildLabelShort = (list: readonly ColorSchemeListItem[]): string => {
		const active = list.find((item) => item.active);
		return active?.labelShort ?? colorScheme;
	};

	const invalidateState = () => {
		cachedState = null;
	};

	const getState = (): ColorSchemeStoreState => {
		if (cachedState === null) {
			const colorSchemeList = buildList();
			cachedState = {
				colorScheme,
				resolvedColorScheme,
				colorSchemeList,
				labelShort: buildLabelShort(colorSchemeList),
			};
		}
		return cachedState;
	};

	const setPreference = (next: ColorSchemePreference) => {
		if (!isColorSchemePreference(next, schemes, includeSystemScheme)) {
			return;
		}
		if (next === colorScheme) {
			return;
		}
		colorScheme = next;
		syncResolvedScheme();
		invalidateState();
		applyCurrentScheme(true);
		if (options.storage) {
			writePersistedColorScheme(options.storage.key, colorScheme);
		}
		notify();
	};

	const changeColorScheme = (next?: ColorSchemePreference) => {
		const resolved =
			next !== undefined
				? next
				: nextPreferenceInCycle(schemes, colorScheme, includeSystemScheme);
		setPreference(resolved);
	};

	let storageListener: ((event: StorageEvent) => void) | undefined;
	let systemPreferenceListener: ((event: MediaQueryListEvent) => void) | undefined;
	let systemMediaQuery: MediaQueryList | null = null;

	const attachSystemPreferenceListener = () => {
		if (
			typeof window === 'undefined' ||
			typeof window.matchMedia !== 'function' ||
			!includeSystemScheme
		) {
			return;
		}

		systemMediaQuery = window.matchMedia(PREFERS_COLOR_SCHEME_QUERY);
		systemPreferenceListener = () => {
			if (colorScheme !== SYSTEM_COLOR_SCHEME) {
				return;
			}
			syncResolvedScheme();
			invalidateState();
			applyCurrentScheme();
			notify();
		};
		systemMediaQuery.addEventListener('change', systemPreferenceListener);
	};

	const detachSystemPreferenceListener = () => {
		if (systemMediaQuery && systemPreferenceListener) {
			systemMediaQuery.removeEventListener('change', systemPreferenceListener);
		}
		systemMediaQuery = null;
		systemPreferenceListener = undefined;
	};

	const mount = () => {
		const stored = options.storage ? readRawStorageValue(options.storage) : null;
		colorScheme = resolveColorSchemePreference({
			schemes,
			preset,
			stored,
			includeSystemScheme,
		});
		syncResolvedScheme();
		invalidateState();
		applyVariables();

		if (applyOnMount) {
			applyCurrentScheme();
		}

		notify();
		attachSystemPreferenceListener();

		if (!options.storage) {
			return;
		}

		storageListener = (event: StorageEvent) => {
			if (event.key !== options.storage?.key) return;
			const next = event.newValue;
			if (
				next &&
				isColorSchemePreference(next, schemes, includeSystemScheme) &&
				next !== colorScheme
			) {
				colorScheme = next;
				syncResolvedScheme();
				invalidateState();
				applyCurrentScheme();
				notify();
			}
		};

		window.addEventListener('storage', storageListener);
	};

	if (typeof window !== 'undefined') {
		mount();
	}

	return {
		subscribe: (listener) => {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
		getState,
		changeColorScheme,
		dispose: () => {
			if (storageListener && typeof window !== 'undefined') {
				window.removeEventListener('storage', storageListener);
			}
			detachSystemPreferenceListener();
			listeners.clear();
		},
	};
}
