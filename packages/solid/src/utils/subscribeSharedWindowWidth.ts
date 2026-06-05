import { batch, createSignal, type Accessor } from 'solid-js';

let widthTuple: ReturnType<typeof createSignal<number>> | null = null;
let refCount = 0;
let resizeHandler: (() => void) | null = null;

function getWidthSignal(): ReturnType<typeof createSignal<number>> {
	if (!widthTuple) {
		const [width, setWidth] = createSignal(
			typeof window !== 'undefined' ? window.innerWidth : 0,
		);
		widthTuple = [width, setWidth];
	}
	return widthTuple;
}

/**
 * Subscribes to the shared ref-counted `window` `resize` pipeline used by
 * `useDeviceSize`. Returns the reactive width accessor and a release function
 * (call from `onCleanup`).
 */
export function subscribeSharedWindowWidth(): readonly [Accessor<number>, () => void] {
	const width = getWidthSignal()[0];
	if (typeof window === 'undefined') {
		return [width, () => {}] as const;
	}
	const [, setWidth] = getWidthSignal();
	refCount += 1;
	if (refCount === 1) {
		const handler = () => {
			batch(() => {
				setWidth(window.innerWidth);
			});
		};
		resizeHandler = handler;
		setWidth(window.innerWidth);
		window.addEventListener('resize', handler);
	} else {
		setWidth(window.innerWidth);
	}
	const release = () => {
		if (typeof window === 'undefined') {
			return;
		}
		refCount -= 1;
		if (refCount === 0 && resizeHandler) {
			window.removeEventListener('resize', resizeHandler);
			resizeHandler = null;
		}
	};
	return [width, release] as const;
}
