import { getReducedMotionSnapshot } from './reducedMotion';

const VIEW_TRANSITION_NAME_ATTR = 'data-view-transition-name';
const VIEW_TRANSITION_NAME = 'color-scheme-toggle';

export function updateColorSchemeTogglePosition(el: HTMLElement): void {
	if (typeof document === 'undefined') return;

	const pos = el.getBoundingClientRect();
	const centerX = pos.x + pos.width / 2;
	const centerY = pos.y + pos.height / 2;
	const root = document.documentElement;
	root.style.setProperty('--cs-toggle-pos-x', `${centerX}px`);
	root.style.setProperty('--cs-toggle-pos-y', `${centerY}px`);
}

function clearViewTransitionName(): void {
	if (typeof document === 'undefined') return;
	document.documentElement.removeAttribute(VIEW_TRANSITION_NAME_ATTR);
}

export function startColorSchemeViewTransition(updateDom: () => void): void {
	if (typeof document === 'undefined') {
		updateDom();
		return;
	}

	if (typeof document.startViewTransition !== 'function') {
		updateDom();
		return;
	}

	const startViewTransition = document.startViewTransition.bind(document);
	if (getReducedMotionSnapshot()) {
		updateDom();
		return;
	}

	document.documentElement.setAttribute(VIEW_TRANSITION_NAME_ATTR, VIEW_TRANSITION_NAME);

	const transition = startViewTransition(() => {
		updateDom();
	});

	void transition.finished.finally(clearViewTransitionName);
}
