import {
	createColorSchemeStore,
	type ColorSchemeStore,
	type ColorSchemeStoreOptions,
} from './createColorSchemeStore';

let sharedStore: ColorSchemeStore | null = null;
let refCount = 0;

/**
 * Returns the module singleton color-scheme store, creating it on first call.
 * Options from the first call are used; later calls return the existing store.
 */
export function peekOrCreateSharedColorSchemeStore(
	options: ColorSchemeStoreOptions,
): ColorSchemeStore {
	if (!sharedStore) {
		sharedStore = createColorSchemeStore(options);
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
	}
}

/** @internal Resets module state between tests. */
export function resetSharedColorSchemeStoreForTests(): void {
	sharedStore?.dispose();
	sharedStore = null;
	refCount = 0;
}
