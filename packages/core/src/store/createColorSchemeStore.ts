import { applyColorScheme } from '../applyColorScheme';
import { applyAdditionalVariables } from '../applyAdditionalVariables';
import {
	DEFAULT_SCHEMES,
	deriveThemeMeta,
	isKnownScheme,
	type ColorSchemeId,
	type ThemeMetaItem,
	type ThemeStorageConfig,
} from '../colorScheme.types';
import {
	readStoredColorScheme,
	writePersistedColorScheme,
} from '../colorSchemeStorage';

export type ColorSchemeListItem = ThemeMetaItem & {
	readonly active: boolean;
};

export type ColorSchemeStoreState = {
	readonly colorScheme: ColorSchemeId;
	readonly colorSchemeList: readonly ColorSchemeListItem[];
	readonly labelShort: string;
};

export type ColorSchemeStoreOptions = {
	readonly schemes: readonly string[];
	readonly themeMeta?: readonly ThemeMetaItem[];
	readonly presetColorScheme?: ColorSchemeId;
	readonly storage?: ThemeStorageConfig;
	readonly applyColorSchemeOnMount?: boolean;
	readonly additionalVariables?: Record<string, string>;
};

export type ColorSchemeStore = {
	readonly subscribe: (listener: () => void) => () => void;
	readonly getState: () => ColorSchemeStoreState;
	readonly changeColorScheme: (next?: ColorSchemeId) => void;
	readonly dispose: () => void;
};

function resolveInitialColorScheme(
	schemes: readonly string[],
	preset: ColorSchemeId,
	storage?: ThemeStorageConfig,
): ColorSchemeId {
	const stored = storage ? readStoredColorScheme(storage) : null;
	if (stored && isKnownScheme(stored, schemes)) return stored;
	if (isKnownScheme(preset, schemes)) return preset;
	return schemes[0] ?? DEFAULT_SCHEMES[0];
}

function nextSchemeInCycle(schemes: readonly string[], current: ColorSchemeId): ColorSchemeId {
	const index = schemes.indexOf(current);
	if (index === -1 || schemes.length === 0) return schemes[0] ?? current;
	return schemes[(index + 1) % schemes.length] ?? current;
}

export function createColorSchemeStore(options: ColorSchemeStoreOptions): ColorSchemeStore {
	const schemes = options.schemes.length > 0 ? options.schemes : DEFAULT_SCHEMES;
	const themeMeta = options.themeMeta ?? deriveThemeMeta(schemes);
	const preset = options.presetColorScheme ?? schemes[0] ?? DEFAULT_SCHEMES[0];
	const applyOnMount = options.applyColorSchemeOnMount ?? true;

	const listeners = new Set<() => void>();
	const notify = () => {
		for (const listener of listeners) {
			listener();
		}
	};

	let colorScheme: ColorSchemeId = schemes[0] ?? DEFAULT_SCHEMES[0];
	let appliedVariableKeys: string[] = [];
	let cachedState: ColorSchemeStoreState | null = null;

	const applyVariables = () => {
		appliedVariableKeys = applyAdditionalVariables(options.additionalVariables, appliedVariableKeys);
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
				colorSchemeList,
				labelShort: buildLabelShort(colorSchemeList),
			};
		}
		return cachedState;
	};

	const changeColorScheme = (next?: ColorSchemeId) => {
		const resolved =
			next !== undefined ? next : nextSchemeInCycle(schemes, colorScheme);
		if (!isKnownScheme(resolved, schemes)) return;
		if (resolved === colorScheme) return;
		colorScheme = resolved;
		invalidateState();
		applyColorScheme(resolved);
		if (options.storage) {
			writePersistedColorScheme(options.storage.key, resolved);
		}
		notify();
	};

	let storageListener: ((event: StorageEvent) => void) | undefined;

	const mount = () => {
		const initialScheme = resolveInitialColorScheme(schemes, preset, options.storage);
		colorScheme = initialScheme;
		invalidateState();
		applyVariables();

		if (applyOnMount) {
			applyColorScheme(initialScheme);
		}

		notify();

		if (!options.storage || options.storage.type !== 'localStorage') {
			return;
		}

		storageListener = (event: StorageEvent) => {
			if (event.key !== options.storage?.key) return;
			const next = event.newValue;
			if (next && isKnownScheme(next, schemes) && next !== colorScheme) {
				colorScheme = next;
				invalidateState();
				applyColorScheme(next);
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
			listeners.clear();
		},
	};
}
