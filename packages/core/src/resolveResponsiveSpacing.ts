import type { DeviceMatchesContext, ResponsiveSpacingInputValue, ThemeConfigInput } from './config/types';
import { isPlainObject } from './utils/isPlainObject';

export function isResponsiveSpacingMap<C extends ThemeConfigInput>(
	value: ResponsiveSpacingInputValue<C>,
): value is Exclude<ResponsiveSpacingInputValue<C>, string | number> {
	return isPlainObject(value);
}

/** Picks the first matching breakpoint value, then the first map entry, then the scalar. */
export function resolveResponsiveSpacingValue<C extends ThemeConfigInput>(
	value: ResponsiveSpacingInputValue<C>,
	deviceMatches?: DeviceMatchesContext,
): string | number | undefined {
	if (!isResponsiveSpacingMap(value)) {
		return value;
	}

	const map = value as Readonly<Partial<Record<string, string | number>>>;

	if (deviceMatches) {
		for (const [breakpoint, matches] of Object.entries(deviceMatches)) {
			if (matches && map[breakpoint] !== undefined) {
				return map[breakpoint];
			}
		}
	}

	const first = Object.values(map)[0];
	return first;
}
