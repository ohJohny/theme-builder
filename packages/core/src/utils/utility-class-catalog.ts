import { collectPresetUtilityClassNames } from './theme-token-spec';

/** All canonical global utility class names generated from theme SCSS. */
export function collectUtilityClassNames(): readonly string[] {
	return collectPresetUtilityClassNames();
}
