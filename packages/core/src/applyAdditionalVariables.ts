import { applyThemeVariables } from './applyThemeVariables';

export function applyAdditionalVariables(
	variables: Record<string, string> | undefined,
	previousKeys: readonly string[] = [],
): string[] {
	return applyThemeVariables(variables, undefined, previousKeys);
}
