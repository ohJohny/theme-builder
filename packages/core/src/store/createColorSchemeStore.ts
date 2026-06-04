import { applyColorScheme } from '../applyColorScheme';
import { applyAdditionalVariables } from '../applyAdditionalVariables';
import {
	DEFAULT_THEME_META,
	isColorSchemeId,
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
	preset: ColorSchemeId,
	storage?: ThemeStorageConfig,
): ColorSchemeId {
	const stored = storage ? readStoredColorScheme(storage) : null;
	if (stored) return stored;
	return preset;
}

export function createColorSchemeStore(options: ColorSchemeStoreOptions = {}): ColorSchemeStore {
	const themeMeta = options.themeMeta ?? DEFAULT_THEME_META;
	const preset = options.presetColorScheme ?? 'light';
	const applyOnMount = options.applyColorSchemeOnMount ?? true;

	const listeners = new Set<() => void>();
	const notify = () => {
		for (const listener of listeners) {
			listener();
		}
	};

	let colorScheme: ColorSchemeId = 'light';
	let appliedVariableKeys: string[] = [];

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

	const getState = (): ColorSchemeStoreState => {
		const colorSchemeList = buildList();
		return {
			colorScheme,
			colorSchemeList,
			labelShort: buildLabelShort(colorSchemeList),
		};
	};

	const changeColorScheme = (next?: ColorSchemeId) => {
		const resolved = next ?? (colorScheme === 'light' ? 'dark' : 'light');
		if (resolved === colorScheme) return;
		colorScheme = resolved;
		applyColorScheme(resolved);
		if (options.storage) {
			writePersistedColorScheme(options.storage.key, resolved);
		}
		notify();
	};

	let storageListener: ((event: StorageEvent) => void) | undefined;

	const mount = () => {
		const initialScheme = resolveInitialColorScheme(preset, options.storage);
		colorScheme = initialScheme;
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
			if (next && isColorSchemeId(next) && next !== colorScheme) {
				colorScheme = next;
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
