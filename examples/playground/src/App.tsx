import { useEffect, useMemo, useRef, useState, type ChangeEvent, type RefObject } from 'react';

import type {
	CreatedTheme,
	CustomClassCssProperties,
	ThemeConfigInput,
} from '@ohJohny/theme-builder/core';
import {
	ThemeProvider,
	useColorScheme,
	useDeviceSize,
	useTheme,
	useUtilityClasses,
	DeviceMatch,
	useColorSchemeTogglePosition,
} from '@ohJohny/theme-builder/react';

import { createPlaygroundTheme } from './createPlaygroundTheme';
import { defaultThemeJson } from './demoTheme';
import './playground.css';

const PLAYGROUND_STORAGE_KEY = 'playground-theme';

function parseThemeJson(
	jsonText: string,
): { created: CreatedTheme<ThemeConfigInput> | null; error: string | null } {
	try {
		const parsed: unknown = JSON.parse(jsonText);
		const created = createPlaygroundTheme(parsed);
		return { created, error: null };
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return { created: null, error: message };
	}
}

function SchemeBar({ toggleRef }: { toggleRef: RefObject<HTMLButtonElement | null> }) {
	const { colorScheme, changeColorScheme } = useColorScheme();
	useColorSchemeTogglePosition(toggleRef);

	return (
		<header className="playground-toolbar">
			<button ref={toggleRef} type="button" className="scheme-toggle" onClick={() => changeColorScheme()}>
				Cycle scheme ({colorScheme})
			</button>
		</header>
	);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section className="playground-section">
			<h2>{title}</h2>
			<div className="token-grid">{children}</div>
		</section>
	);
}

function ColorChip({ name }: { name: string }) {
	const theme = useTheme();
	if (!(name in (theme.colors as Record<string, string>))) {
		return null;
	}
	const { className, style } = useUtilityClasses({ bg: name, p: 'sm' });
	return (
		<div className="token-chip">
			<div className={`color-swatch ${className}`} style={style} />
			<div className="token-chip-label">{name}</div>
		</div>
	);
}

function ColorsSection({ names }: { names: readonly string[] }) {
	return (
		<Section title="Colors">
			{names.map((name) => (
				<ColorChip key={name} name={name} />
			))}
		</Section>
	);
}

function SpacingSection({
	title,
	prefix,
	names,
}: {
	title: string;
	prefix: 'p' | 'm';
	names: readonly string[];
}) {
	return (
		<Section title={title}>
			{names.map((name) => (
				<SpacingChip key={name} prefix={prefix} size={name} />
			))}
		</Section>
	);
}

function SpacingChip({ prefix, size }: { prefix: 'p' | 'm'; size: string }) {
	const props = prefix === 'p' ? { p: size } : { m: size };
	const outer = useUtilityClasses({ ...props, bg: 'surface-container' });
	const inner = useUtilityClasses({ bg: 'action-primary-default' });

	if (prefix === 'm') {
		return (
			<div className="token-chip margin-chip-shell">
				<div className={`margin-chip-box ${outer.className}`} style={outer.style}>
					<div className={`spacing-demo-inner ${inner.className}`} style={inner.style} />
				</div>
				<div className="token-chip-label">
					{prefix}-{size}
				</div>
			</div>
		);
	}

	return (
		<div className={`token-chip ${outer.className}`} style={outer.style}>
			<div className={`spacing-demo-inner ${inner.className}`} style={inner.style} />
			<div className="token-chip-label">
				{prefix}-{size}
			</div>
		</div>
	);
}

function TypographySection({
	sizes,
	fontFamily,
}: {
	sizes: readonly string[];
	fontFamily: string;
}) {
	return (
		<Section title="Typography (font size)">
			{sizes.map((name) => (
				<TypographyChip key={name} fontSize={name} fontFamily={fontFamily} />
			))}
		</Section>
	);
}

function TypographyChip({ fontSize, fontFamily }: { fontSize: string; fontFamily: string }) {
	const { className, style } = useUtilityClasses({
		fontSize,
		font: fontFamily as 'sans',
		color: 'text-primary',
		p: 'sm',
	});
	return (
		<div className={`token-chip typography-sample ${className}`} style={style}>
			text-{fontSize}
		</div>
	);
}

function LineHeightSection({ steps }: { steps: readonly string[] }) {
	return (
		<Section title="Line height">
			{steps.map((step) => (
				<LineHeightChip key={step} step={step} />
			))}
		</Section>
	);
}

function LineHeightChip({ step }: { step: string }) {
	const { className, style } = useUtilityClasses({
		lineHeight: step,
		fontSize: 'md',
		p: 'sm',
	});
	return (
		<div className={`token-chip ${className}`} style={style}>
			lh-{step}
			<br />
			Multi
			<br />
			line
		</div>
	);
}

function ShadowsSection({ names }: { names: readonly string[] }) {
	return (
		<Section title="Shadows">
			{names.map((name) => (
				<ShadowChip key={name} name={name} />
			))}
		</Section>
	);
}

function ShadowChip({ name }: { name: string }) {
	const { className, style } = useUtilityClasses({
		shadow: name,
		p: 'md',
		bg: 'surface-container',
	});
	return (
		<div className={`token-chip ${className}`} style={style}>
			<div className="token-chip-label">shadow-{name}</div>
		</div>
	);
}

function DeviceSizeSection({ breakpointNames }: { breakpointNames: readonly string[] }) {
	const matches = useDeviceSize();

	return (
		<section className="playground-section">
			<h2>Device size</h2>
			<pre className="device-matches-json">{JSON.stringify(matches, null, 4)}</pre>
			<div className="device-match-grid">
				{breakpointNames.map((size) => (
					<DeviceMatch key={size} size={size as 'mobile'}>
						<div className={`device-match-panel device-match-panel--${size}`}>
							<strong>{size}</strong>
							<span>Visible at this breakpoint</span>
						</div>
					</DeviceMatch>
				))}
			</div>
		</section>
	);
}

function IconsSection({ sizes }: { sizes: readonly string[] }) {
	return (
		<Section title="Icons (size)">
			{sizes.map((size) => (
				<IconChip key={size} size={size} />
			))}
		</Section>
	);
}

function IconChip({ size }: { size: string }) {
	const { className, style } = useUtilityClasses({
		icon: size,
		color: 'action-primary-default',
	});

	return (
		<div className="token-chip">
			<div className="icon-chip-preview">
				<svg className={className} style={style} viewBox="0 0 24 24" aria-hidden="true">
					<path
						fill="currentColor"
						d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 17.7 5.7 21l2.3-7-6-4.6h7.6L12 2z"
					/>
				</svg>
			</div>
			<div className="token-chip-label">icon-{size}</div>
		</div>
	);
}

function DisplaySection({ keys }: { keys: readonly string[] }) {
	return (
		<Section title="Display">
			{keys.map((display) => (
				<DisplayChip key={display} display={display} />
			))}
		</Section>
	);
}

function DisplayChip({ display }: { display: string }) {
	const { className, style } = useUtilityClasses({
		display: display as 'block',
		p: 'sm',
		bg: 'body-default',
	});
	return (
		<div className={`token-chip ${className}`} style={style}>
			d-{display}
		</div>
	);
}

function configKeys(record: object | undefined): readonly string[] {
	return record ? Object.keys(record) : [];
}

const CUSTOM_CLASS_META_KEYS = new Set(['withPrefix', 'prefix']);

function customClassNames(classes: ThemeConfigInput['classes']): readonly string[] {
	if (!classes) return [];
	return Object.keys(classes).filter((name) => !CUSTOM_CLASS_META_KEYS.has(name));
}

function CustomClassChip({
	name,
	className,
	properties,
}: {
	name: string;
	className: string;
	properties: CustomClassCssProperties;
}) {
	const propertySummary = Object.entries(properties)
		.map(([key, value]) => `${key}: ${String(value)}`)
		.join('; ');

	return (
		<div className="token-chip custom-class-chip">
			<div className={`custom-class-preview ${className}`}>
				{name === 'badge' ? 'New' : `${name} preview`}
			</div>
			<div className="token-chip-label">
				<strong>{name}</strong> → .{className}
			</div>
			<div className="custom-class-properties" title={propertySummary}>
				{propertySummary}
			</div>
		</div>
	);
}

function CustomClassesSection({ config }: { config: ThemeConfigInput }) {
	const theme = useTheme();
	const names = customClassNames(config.classes);

	if (names.length === 0) {
		return null;
	}

	return (
		<Section title="Custom classes">
			{names.map((name) => {
				const entry = theme.classes[name as keyof typeof theme.classes];
				const properties = config.classes?.[name];
				if (!entry || !properties || typeof properties !== 'object') {
					return null;
				}
				return (
					<CustomClassChip
						key={name}
						name={name}
						className={entry.class}
						properties={properties}
					/>
				);
			})}
		</Section>
	);
}

function PlaygroundPreview({ config }: { config: ThemeConfigInput }) {
	const semanticColors = configKeys(config.colors?.semantic);
	const spacingNames = configKeys(config.spacing);
	const fontSizes = configKeys(config.fonts?.size);
	const lineHeights = configKeys(config.fonts?.lineHeight);
	const shadows = configKeys(config.shadow);
	const iconSizes = configKeys(config.icon);
	const displays = configKeys(config.display);
	const breakpoints = configKeys(config.breakpoints);
	const fontFamily = configKeys(config.fonts?.family)[0] ?? 'sans';

	return (
		<div className="playground-preview">
			<ColorsSection names={semanticColors} />
			<SpacingSection title="Paddings" prefix="p" names={spacingNames} />
			<SpacingSection title="Margins" prefix="m" names={spacingNames} />
			<TypographySection sizes={fontSizes} fontFamily={fontFamily} />
			<LineHeightSection steps={lineHeights} />
			<ShadowsSection names={shadows} />
			<IconsSection sizes={iconSizes} />
			<DisplaySection keys={displays} />
			<CustomClassesSection config={config} />
			<DeviceSizeSection breakpointNames={breakpoints} />
		</div>
	);
}

function ThemeConfigPanel({
	jsonText,
	error,
	onJsonChange,
	showSchemeBar,
	toggleRef,
}: {
	jsonText: string;
	error: string | null;
	onJsonChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
	showSchemeBar: boolean;
	toggleRef: RefObject<HTMLButtonElement | null>;
}) {
	return (
		<aside className="playground-sidebar">
			<h1>Theme Builder Playground</h1>
			{showSchemeBar ? <SchemeBar toggleRef={toggleRef} /> : null}
			<label className="theme-config-label" htmlFor="theme-config-json">
				Theme config (JSON)
			</label>
			<textarea
				id="theme-config-json"
				className="theme-config-editor"
				value={jsonText}
				onChange={onJsonChange}
				spellCheck={false}
			/>
			{error ? <p className="theme-config-error">{error}</p> : null}
		</aside>
	);
}

export function App() {
	const [jsonText, setJsonText] = useState(defaultThemeJson);
	const lastValidTheme = useRef<CreatedTheme<ThemeConfigInput> | null>(null);
	const schemeToggleRef = useRef<HTMLButtonElement | null>(null);

	const { created, error } = useMemo(() => parseThemeJson(jsonText), [jsonText]);

	useEffect(() => {
		if (!created) {
			return;
		}
		lastValidTheme.current = created;
	}, [created]);

	const activeTheme = created ?? lastValidTheme.current;

	function handleJsonChange(event: ChangeEvent<HTMLTextAreaElement>) {
		setJsonText(event.target.value);
	}

	const layout = (
		<div className="playground-layout">
			<ThemeConfigPanel
				jsonText={jsonText}
				error={error}
				onJsonChange={handleJsonChange}
				showSchemeBar={activeTheme !== null}
				toggleRef={schemeToggleRef}
			/>
			<main className="playground-main">
				{activeTheme ? <PlaygroundPreview config={activeTheme.config} /> : null}
			</main>
		</div>
	);

	return (
		<div className="playground">
			{activeTheme ? (
				<ThemeProvider
					theme={activeTheme}
					presetColorScheme={activeTheme.defaultScheme}
					storage={{ type: 'localStorage', key: PLAYGROUND_STORAGE_KEY }}
					viewTransition
				>
					{layout}
				</ThemeProvider>
			) : (
				layout
			)}
		</div>
	);
}
