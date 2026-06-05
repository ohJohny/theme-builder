let width = typeof window !== 'undefined' ? window.innerWidth : 0;
let listeners = new Set<() => void>();
let refCount = 0;
let resizeHandler: (() => void) | null = null;

function notify() {
	for (const listener of listeners) {
		listener();
	}
}

/**
 * Subscribes to the shared ref-counted `window` `resize` pipeline used by
 * `useDeviceSize`. Returns a release function (call from effect cleanup).
 */
export function subscribeSharedWindowWidth(onStoreChange: () => void): () => void {
	if (typeof window === 'undefined') {
		listeners.add(onStoreChange);
		return () => {
			listeners.delete(onStoreChange);
		};
	}

	refCount += 1;
	listeners.add(onStoreChange);

	if (refCount === 1) {
		const handler = () => {
			width = window.innerWidth;
			notify();
		};
		resizeHandler = handler;
		width = window.innerWidth;
		window.addEventListener('resize', handler);
	} else {
		width = window.innerWidth;
	}

	return () => {
		listeners.delete(onStoreChange);
		if (typeof window === 'undefined') {
			return;
		}
		refCount -= 1;
		if (refCount === 0 && resizeHandler) {
			window.removeEventListener('resize', resizeHandler);
			resizeHandler = null;
		}
	};
}

export function getSharedWindowWidthSnapshot(): number {
	return width;
}
