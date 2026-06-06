import { validateThemeConfig } from './validateThemeConfig';
import type { ThemeConfigInput } from './types';

export function defineThemeConfig<const C extends ThemeConfigInput>(config: C): C {
	validateThemeConfig(config);
	return config;
}
