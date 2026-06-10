import type {
	ColorTokenPair,
	IconSizeToken,
	SpacingPrefix,
	TokenClass,
} from '../types/theme.js';
import type { RemLength } from '../utils/remLength.js';

export type BreakpointValue =
	| { readonly min: RemLength; readonly max?: never }
	| { readonly max: RemLength; readonly min?: never }
	| { readonly min: RemLength; readonly max: RemLength };

export type ColorValue = string | Readonly<Record<string, string>>;

export interface ThemeFontsConfigInput {
	readonly family?: Readonly<Record<string, string>>;
	readonly size?: Readonly<Record<string, string>>;
	readonly weight?: Readonly<Record<string | number, string>>;
	readonly lineHeight?: Readonly<Record<string | number, string>>;
}

export interface ThemeColorsConfigInput {
	readonly base?: Readonly<Record<string, string>>;
	readonly semantic?: Readonly<Record<string, ColorValue>>;
}

/** Framework-agnostic CSS object (camelCase keys, string | number values). */
export type CustomClassCssProperties = Readonly<Record<string, string | number>>;

export interface ThemeCustomClassesConfigInput {
	readonly withPrefix?: boolean;
	readonly prefix?: string;
	readonly [className: string]: CustomClassCssProperties | boolean | string | undefined;
}

export interface ThemeConfigInput {
	readonly schemes?: readonly string[];
	/** Root rem reference — emits `--rem-base` (default `16px`) and sets `:root { font-size: var(--rem-base) }`. */
	readonly remBase?: string;
	readonly colors?: ThemeColorsConfigInput;
	readonly spacing?: Readonly<Record<string, string>>;
	readonly fonts?: ThemeFontsConfigInput;
	readonly shadow?: Readonly<Record<string, string>>;
	readonly icon?: Readonly<Record<string, string>>;
	readonly display?: Readonly<Record<string, string>>;
	readonly breakpoints?: Readonly<Record<string, BreakpointValue>>;
	readonly classes?: ThemeCustomClassesConfigInput;
}

export type DefaultSchemes = readonly ['light', 'dark'];

export type SchemeName<C extends ThemeConfigInput> = C extends {
	readonly schemes: infer S extends readonly string[];
}
	? S[number]
	: DefaultSchemes[number];

export type SpacingName<C extends ThemeConfigInput> =
	keyof NonNullable<C['spacing']> & string;

/** Gap utilities use the same token names as `spacing`. */
export type GapName<C extends ThemeConfigInput> = SpacingName<C>;

export type BaseColorName<C extends ThemeConfigInput> =
	keyof NonNullable<NonNullable<C['colors']>['base']> & string;

export type SemanticColorName<C extends ThemeConfigInput> =
	keyof NonNullable<NonNullable<C['colors']>['semantic']> & string;

export type ColorName<C extends ThemeConfigInput> = BaseColorName<C> | SemanticColorName<C>;

export type FontFamilyName<C extends ThemeConfigInput> =
	keyof NonNullable<NonNullable<C['fonts']>['family']> & string;

export type FontSizeName<C extends ThemeConfigInput> =
	keyof NonNullable<NonNullable<C['fonts']>['size']> & string;

export type FontWeightName<C extends ThemeConfigInput> =
	keyof NonNullable<NonNullable<C['fonts']>['weight']> & string;

export type LineHeightName<C extends ThemeConfigInput> =
	keyof NonNullable<NonNullable<C['fonts']>['lineHeight']> & string;

export type ShadowName<C extends ThemeConfigInput> =
	keyof NonNullable<C['shadow']> & string;

export type IconSizeName<C extends ThemeConfigInput> =
	keyof NonNullable<C['icon']> & string;

export type DisplayName<C extends ThemeConfigInput> =
	keyof NonNullable<C['display']> & string;

export type CustomClassName<C extends ThemeConfigInput> =
	keyof Omit<NonNullable<C['classes']>, 'withPrefix' | 'prefix'> & string;

export type ThemeCustomClasses<C extends ThemeConfigInput> = Readonly<
	Record<CustomClassName<C>, { readonly class: string }>
>;

export type ThemeColors<C extends ThemeConfigInput> = Readonly<
	Record<BaseColorName<C> | SemanticColorName<C>, string>
>;

export type ThemeBaseColorUtilities<C extends ThemeConfigInput> = {
	readonly tokens: Readonly<Record<BaseColorName<C>, ColorTokenPair>>;
};

export type ThemeSemanticColorUtilities<C extends ThemeConfigInput> = {
	readonly tokens: Readonly<Record<SemanticColorName<C>, ColorTokenPair>>;
};

export type ThemeColorUtilities<C extends ThemeConfigInput> = {
	readonly base: ThemeBaseColorUtilities<C>;
	readonly semantic: ThemeSemanticColorUtilities<C>;
};

export type SpacingGroup<C extends ThemeConfigInput> = Readonly<
	Record<SpacingName<C>, TokenClass>
>;

export type ThemeSpacing<C extends ThemeConfigInput> = Readonly<
	Record<SpacingPrefix, SpacingGroup<C>>
>;

export type GapScale<C extends ThemeConfigInput> = Readonly<Record<GapName<C>, TokenClass>>;

export type ThemeFonts<C extends ThemeConfigInput> = {
	readonly family: Readonly<Record<FontFamilyName<C>, TokenClass>>;
	readonly size: Readonly<Record<FontSizeName<C>, TokenClass>>;
	readonly weight: Readonly<Record<FontWeightName<C>, TokenClass>>;
	readonly lineHeight: Readonly<Record<LineHeightName<C>, TokenClass>>;
};

export type ThemeDisplay<C extends ThemeConfigInput> = Readonly<
	Record<DisplayName<C>, TokenClass>
>;

export type ShadowScale<C extends ThemeConfigInput> = Readonly<Record<ShadowName<C>, TokenClass>>;

export type IconSizeScale<C extends ThemeConfigInput> = Readonly<
	Record<IconSizeName<C>, IconSizeToken>
>;

export type Theme<C extends ThemeConfigInput> = {
	readonly colors: ThemeColors<C>;
	readonly colorUtilities: ThemeColorUtilities<C>;
	readonly spacing: ThemeSpacing<C>;
	readonly gap: GapScale<C>;
	readonly fonts: ThemeFonts<C>;
	readonly icon: IconSizeScale<C>;
	readonly display: ThemeDisplay<C>;
	readonly shadow: ShadowScale<C>;
	readonly classes: ThemeCustomClasses<C>;
};

export type UtilityClassMapMode = 'identity' | 'hashed';

export type CreateThemeOptions<C extends ThemeConfigInput> = {
	readonly mode?: UtilityClassMapMode;
	readonly inject?: boolean;
	readonly defaultScheme?: SchemeName<C>;
	/** Salt for hashed utility class names; defaults to `UTILITY_CLASS_HASH_SALT`. */
	readonly utilityClassHashSalt?: string;
	/** Prefix for hashed utility class names; defaults to `UTILITY_CLASS_HASH_PREFIX`. */
	readonly utilityClassHashPrefix?: string;
};

export type CreatedTheme<C extends ThemeConfigInput> = {
	readonly config: C;
	readonly schemes: readonly string[];
	readonly defaultScheme: string;
	readonly theme: Theme<C>;
	readonly classMap: Readonly<Record<string, string>>;
	readonly mode: UtilityClassMapMode;
};

export type SpacingInputValue<C extends ThemeConfigInput> =
	| SpacingName<C>
	| (string & {})
	| (number & {});

export type FontSizeInputValue<C extends ThemeConfigInput> =
	| FontSizeName<C>
	| (string & {})
	| (number & {});

export type IconSizeInputValue<C extends ThemeConfigInput> =
	| IconSizeName<C>
	| (number & {});

export type LineHeightInputValue<C extends ThemeConfigInput> =
	| LineHeightName<C>
	| (string & {})
	| (number & {});

export type ShadowInputValue<C extends ThemeConfigInput> =
	| ShadowName<C>
	| (string & {});

export type UtilityProps<C extends ThemeConfigInput> = {
	readonly className?: string;
	readonly color?: ColorName<C> | (string & {});
	readonly bg?: ColorName<C> | (string & {});
	readonly gap?: SpacingInputValue<C>;
	readonly font?: FontFamilyName<C> | (string & {});
	readonly fontSize?: FontSizeInputValue<C>;
	readonly fontWeight?: FontWeightName<C> | (string & {}) | number;
	readonly lineHeight?: LineHeightInputValue<C>;
	readonly display?: DisplayName<C> | (string & {});
	readonly shadow?: ShadowInputValue<C>;
	readonly icon?: IconSizeInputValue<C>;
} & {
	readonly [K in SpacingPrefix]?: SpacingInputValue<C>;
};
