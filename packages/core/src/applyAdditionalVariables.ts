function normalizeVariableName(key: string): string {
    return key.startsWith('--') ? key : `--${key}`;
}

export function applyAdditionalVariables(
    variables: Record<string, string> | undefined,
    previousKeys: readonly string[] = [],
): string[] {
    if (typeof document === 'undefined') {
        return variables ? Object.keys(variables).map(normalizeVariableName) : [];
    }

    const root = document.documentElement;
    const nextKeys = new Set<string>();

    if (variables) {
        for (const [key, value] of Object.entries(variables)) {
            const name = normalizeVariableName(key);
            nextKeys.add(name);
            root.style.setProperty(name, value);
        }
    }

    for (const key of previousKeys) {
        if (!nextKeys.has(key)) {
            root.style.removeProperty(key);
        }
    }

    return [...nextKeys];
}
