export function normalizeVariableName(key: string): string {
	return key.startsWith('--') ? key : `--${key}`;
}
