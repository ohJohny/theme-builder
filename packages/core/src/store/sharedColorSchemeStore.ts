import type { ColorSchemeStoreOptions } from './colorSchemeStoreOptions';
import {
	createColorSchemeStore,
	type ColorSchemeStore,
} from './createColorSchemeStore';

let sharedStore: ColorSchemeStore | null = null;
let firstOptions: ColorSchemeStoreOptions | null = null;
let refCount = 0;

function isDevEnvironment(): boolean {
	return (
		(typeof import.meta !== 'undefined' &&
			(import.meta as { env?: { DEV?: boolean } }).env?.DEV === true) ||
		process.env.NODE_ENV === 'development'
	);
}

function warnOptionMismatch(next: ColorSchemeStoreOptions): void {
	if (!isDevEnvironment() || firstOptions === null) {
		return;
	}

	const mismatches: string[] = [];
	if (firstOptions.storage?.key !== next.storage?.key) {
		mismatches.push(
			`storage.key (${firstOptions.storage?.key ?? 'none'} vs ${next.storage?.key ?? 'none'})`,
		);
	}
	if (firstOptions.storage?.type !== next.storage?.type) {
		mismatches.push(
			`storage.type (${firstOptions.storage?.type ?? 'none'} vs ${next.storage?.type ?? 'none'})`,
		);
	}
	if (firstOptions.presetColorScheme !== next.presetColorScheme) {
		mismatches.push(
			`presetColorScheme (${firstOptions.presetColorScheme ?? 'default'} vs ${next.presetColorScheme ?? 'default'})`,
		);
	}
	if (firstOptions.includeSystemScheme !== next.includeSystemScheme) {
		mismatches.push('includeSystemScheme');
	}

	if (mismatches.length > 0) {
		console.warn(
			`[theme-builder] SingletonThemeProvider option mismatch (first mount wins): ${mismatches.join(', ')}`,
		);
	}
}

/**
 * Returns the module singleton color-scheme store, creating it on first call.
 * Options from the first call are used; later calls return the existing store.
 */
export function peekOrCreateSharedColorSchemeStore(
	options: ColorSchemeStoreOptions,
): ColorSchemeStore {
	if (!sharedStore) {
		firstOptions = options;
		sharedStore = createColorSchemeStore(options);
	} else {
		warnOptionMismatch(options);
	}
	return sharedStore;
}

/** Increments the active {@link SingletonThemeProvider} mount count. */
export function retainSharedColorSchemeStore(): void {
	refCount += 1;
}

/**
 * Decrements the mount count and disposes the store when no mounts remain.
 */
export function releaseSharedColorSchemeStore(): void {
	refCount -= 1;
	if (refCount <= 0) {
		refCount = 0;
		sharedStore?.dispose();
		sharedStore = null;
		firstOptions = null;
	}
}

/** @internal Resets module state between tests. */
export function resetSharedColorSchemeStoreForTests(): void {
	sharedStore?.dispose();
	sharedStore = null;
	firstOptions = null;
	refCount = 0;
}
