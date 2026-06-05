/**
 * Publishes @ohJohny/theme-builder (umbrella) to GitHub Packages.
 * Stages root dist/ into packages/theme-builder/dist, rewrites exports to ./dist,
 * and rewrites framework bundle imports to relative core paths.
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = 'theme-builder';
const coreImport = '@ohJohny/theme-builder-core';
const relativeCoreJs = '../core/index.js';
const umbrellaCoreTypes = '@ohJohny/theme-builder/core';

const umbrellaPkg = JSON.parse(
	readFileSync(path.join(root, 'packages', pkg, 'package.json'), 'utf8'),
) as { version: string };
const version = umbrellaPkg.version;

type PkgJson = {
	exports?: Record<string, unknown>;
};

function rewriteExportsForPublish(pkgJson: PkgJson): void {
	if (!pkgJson.exports) return;
	const from = '../../dist';
	const to = './dist';
	const serialized = JSON.stringify(pkgJson.exports).replaceAll(from, to);
	pkgJson.exports = JSON.parse(serialized) as PkgJson['exports'];
}

function rewriteFileImports(filePath: string, isTypes: boolean): void {
	let content = readFileSync(filePath, 'utf8');
	const replacement = isTypes ? umbrellaCoreTypes : relativeCoreJs;
	if (!content.includes(coreImport)) return;
	content = content.replaceAll(coreImport, replacement);
	writeFileSync(filePath, content);
}

async function walkFiles(dir: string, onFile: (filePath: string) => void): Promise<void> {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const filePath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			await walkFiles(filePath, onFile);
			continue;
		}
		onFile(filePath);
	}
}

async function rewriteFrameworkBundles(distDir: string): Promise<void> {
	for (const framework of ['react', 'solid'] as const) {
		rewriteFileImports(path.join(distDir, framework, 'index.js'), false);

		const typesDir = path.join(distDir, framework, 'types');
		await walkFiles(typesDir, (filePath) => {
			if (filePath.endsWith('.d.ts')) {
				rewriteFileImports(filePath, true);
			}
		});
	}
}

const pkgDir = path.join(root, 'packages', pkg);
const pkgPath = path.join(pkgDir, 'package.json');
const stagedDist = path.join(pkgDir, 'dist');
const original = readFileSync(pkgPath, 'utf8');

try {
	await cp(path.join(root, 'dist'), stagedDist, { recursive: true });

	const pkgJson = JSON.parse(original) as PkgJson;
	rewriteExportsForPublish(pkgJson);
	writeFileSync(pkgPath, `${JSON.stringify(pkgJson, null, '\t')}\n`);

	await rewriteFrameworkBundles(stagedDist);

	console.log(`Publishing @ohJohny/theme-builder@${version}...`);
	execSync('npm publish', {
		cwd: pkgDir,
		stdio: 'inherit',
		env: { ...process.env },
	});
} finally {
	writeFileSync(pkgPath, original);
	await rm(stagedDist, { recursive: true, force: true });
}
