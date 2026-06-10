const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const REDUCED_MOTION_ATTR = 'data-reduced-motion';

let reducedMotion = false;
const listeners = new Set<() => void>();
let refCount = 0;
let mediaQuery: MediaQueryList | null = null;
let changeHandler: ((event: MediaQueryListEvent) => void) | null = null;

function notify() {
	for (const listener of listeners) {
		listener();
	}
}

export function applyReducedMotion(value: boolean): void {
	if (typeof document === 'undefined') return;
	if (value) {
		document.documentElement.setAttribute(REDUCED_MOTION_ATTR, 'true');
	} else {
		document.documentElement.removeAttribute(REDUCED_MOTION_ATTR);
	}
}

function readReducedMotionFromMediaQuery(mq: MediaQueryList): boolean {
	return mq.matches;
}

function attachMediaQueryListener(): void {
	if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
		return;
	}

	mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
	reducedMotion = readReducedMotionFromMediaQuery(mediaQuery);
	applyReducedMotion(reducedMotion);

	changeHandler = () => {
		if (!mediaQuery) return;
		reducedMotion = readReducedMotionFromMediaQuery(mediaQuery);
		applyReducedMotion(reducedMotion);
		notify();
	};
	mediaQuery.addEventListener('change', changeHandler);
}

function detachMediaQueryListener(): void {
	if (mediaQuery && changeHandler) {
		mediaQuery.removeEventListener('change', changeHandler);
	}
	mediaQuery = null;
	changeHandler = null;
	if (typeof document !== 'undefined') {
		document.documentElement.removeAttribute(REDUCED_MOTION_ATTR);
	}
}

/**
 * Subscribes to the shared ref-counted `prefers-reduced-motion` pipeline.
 * Returns a release function (call from effect cleanup).
 */
export function subscribeReducedMotion(onStoreChange: () => void): () => void {
	if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
		listeners.add(onStoreChange);
		return () => {
			listeners.delete(onStoreChange);
		};
	}

	refCount += 1;
	listeners.add(onStoreChange);

	if (refCount === 1) {
		attachMediaQueryListener();
	} else if (mediaQuery) {
		reducedMotion = readReducedMotionFromMediaQuery(mediaQuery);
		applyReducedMotion(reducedMotion);
	}

	return () => {
		listeners.delete(onStoreChange);
		if (typeof window === 'undefined') {
			return;
		}
		refCount -= 1;
		if (refCount === 0) {
			detachMediaQueryListener();
		}
	};
}

export function getReducedMotionSnapshot(): boolean {
	return reducedMotion;
}

/** @internal Resets module state between tests. */
export function resetReducedMotionForTests(): void {
	listeners.clear();
	refCount = 0;
	detachMediaQueryListener();
	reducedMotion = false;
	if (typeof document !== 'undefined') {
		document.documentElement.removeAttribute(REDUCED_MOTION_ATTR);
	}
}
