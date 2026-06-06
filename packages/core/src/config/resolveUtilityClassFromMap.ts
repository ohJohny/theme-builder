export function resolveUtilityClassFromMap(
	canonical: string,
	classMap: Readonly<Record<string, string>>,
): string {
	if (canonical in classMap) {
		return classMap[canonical];
	}
	throw new Error(`[resolveUtilityClass] unknown utility class: ${canonical}`);
}
