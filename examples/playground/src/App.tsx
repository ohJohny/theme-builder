import { useState } from 'react';

import {
	RawThemeBuilder,
	ThemeBuilder,
	ThemeProvider,
	useColorScheme,
	useDeviceSize,
	useTheme,
	useUtilityClasses,
	type SpacingSizeName,
} from '@ohJohny/theme-builder-react';

import { demoThemeConfig, spacingSizeNames } from './demoTheme';
import './playground.css';

RawThemeBuilder.getInstance().apply(demoThemeConfig, undefined, {
	extendSingleton: false,
	inlineVariables: false,
});

function ExtendThemeBar() {
	const [value, setValue] = useState('#7c3aed');
	const { colorScheme, changeColorScheme } = useColorScheme();

	const applyCustom = () => {
		const name = `custom-brand`;
		RawThemeBuilder.getInstance().apply(
			{
				colors: { [name]: value },
			},
			undefined,
			{ extendSingleton: true },
		);
		ThemeBuilder.getInstance().extend({
			colors: { [name]: `var(--color-${name})` },
		});
	};

	return (
		<header className="playground-header">
			<h1>Theme Builder Playground</h1>
			<input
				type="color"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				aria-label="Custom brand color"
			/>
			<button type="button" onClick={applyCustom}>
				Extend theme
			</button>
			<button type="button" onClick={() => changeColorScheme()}>
				Toggle {colorScheme}
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

function ColorsSection() {
	const tokens = [
		'text-primary',
		'text-secondary',
		'surface-main',
		'surface-container',
		'action-primary-default',
		'custom-brand',
	] as const;

	return (
		<Section title="Colors">
			{tokens.map((name) => (
				<ColorChip key={name} name={name} />
			))}
		</Section>
	);
}

function SpacingSection({ title, prefix }: { title: string; prefix: 'p' | 'm' }) {
	return (
		<Section title={title}>
			{spacingSizeNames.map((name) => (
				<SpacingChip key={name} prefix={prefix} size={name} />
			))}
		</Section>
	);
}

function SpacingChip({ prefix, size }: { prefix: 'p' | 'm'; size: SpacingSizeName }) {
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

function TypographySection() {
	const sizes = ['xs', 'sm', 'md', 'mdl', 'lg', 'xl', 'xxl', 'giant'] as const;
	return (
		<Section title="Typography (font size)">
			{sizes.map((name) => (
				<TypographyChip key={name} fontSize={name} />
			))}
		</Section>
	);
}

function TypographyChip({
	fontSize,
}: {
	fontSize: 'xs' | 'sm' | 'md' | 'mdl' | 'lg' | 'xl' | 'xxl' | 'giant';
}) {
	const { className, style } = useUtilityClasses({
		fontSize,
		font: 'sans',
		color: 'text-primary',
		p: 'sm',
	});
	return (
		<div className={`token-chip typography-sample ${className}`} style={style}>
			text-{fontSize}
		</div>
	);
}

function LineHeightSection() {
	const steps = [100, 125, 150, 175, 200] as const;
	return (
		<Section title="Line height">
			{steps.map((step) => (
				<LineHeightChip key={step} step={step} />
			))}
		</Section>
	);
}

function LineHeightChip({ step }: { step: 100 | 125 | 150 | 175 | 200 }) {
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

function ShadowsSection() {
	const names = ['sm', 'md', 'lg', 'xl'] as const;
	return (
		<Section title="Shadows">
			{names.map((name) => (
				<ShadowChip key={name} name={name} />
			))}
		</Section>
	);
}

function ShadowChip({ name }: { name: 'sm' | 'md' | 'lg' | 'xl' }) {
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

function DeviceSizeSection() {
	const matches = useDeviceSize();

	return (
		<section className="playground-section">
			<h2>Device size</h2>
			<pre className="device-matches-json">{JSON.stringify(matches, null, 4)}</pre>
		</section>
	);
}

function DisplaySection() {
	const keys = ['block', 'flex', 'grid', 'none'] as const;
	return (
		<Section title="Display">
			{keys.map((d) => (
				<DisplayChip key={d} display={d} />
			))}
		</Section>
	);
}

function DisplayChip({ display }: { display: 'block' | 'flex' | 'grid' | 'none' }) {
	const { className, style } = useUtilityClasses({ display, p: 'sm', bg: 'body-default' });
	return (
		<div className={`token-chip ${className}`} style={style}>
			d-{display}
		</div>
	);
}

export function App() {
	return (
		<ThemeProvider presetColorScheme="light">
			<div className="playground">
				<ExtendThemeBar />
				<ColorsSection />
				<SpacingSection title="Paddings" prefix="p" />
				<SpacingSection title="Margins" prefix="m" />
				<TypographySection />
				<LineHeightSection />
				<ShadowsSection />
				<DisplaySection />
				<DeviceSizeSection />
			</div>
		</ThemeProvider>
	);
}
