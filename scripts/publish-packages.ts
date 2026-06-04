/**
 * Publishes @ohJohny/theme-builder-* packages to GitHub Packages.
 * Stages root dist/{pkg} into packages/{pkg}/dist, rewrites exports to ./dist,
 * rewrites workspace:* deps to ^<version>, then restores package.json and removes staged dist.
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publishOrder = ['core', 'react', 'solid'] as const;

const corePkg = JSON.parse(
	readFileSync(path.join(root, 'packages', 'core', 'package.json'), 'utf8'),
) as { version: string };
const version = corePkg.version;

const workspacePattern = /^workspace:(\*|\^|~)?$/;

type PkgJson = {
	dependencies?: Record<string, string>;
	exports?: Record<string, unknown>;
};

function rewriteWorkspaceDeps(pkgJson: PkgJson): void {
	if (!pkgJson.dependencies) return;
	for (const [name, value] of Object.entries(pkgJson.dependencies)) {
		if (workspacePattern.test(value)) {
			pkgJson.dependencies[name] = `^${version}`;
		}
	}
}

function rewriteExportsForPublish(pkgJson: PkgJson, pkg: string): void {
	if (!pkgJson.exports) return;
	const from = `../../dist/${pkg}`;
	const to = './dist';
	const serialized = JSON.stringify(pkgJson.exports).replaceAll(from, to);
	pkgJson.exports = JSON.parse(serialized) as PkgJson['exports'];
}

for (const pkg of publishOrder) {
	const pkgDir = path.join(root, 'packages', pkg);
	const pkgPath = path.join(pkgDir, 'package.json');
	const stagedDist = path.join(pkgDir, 'dist');
	const original = readFileSync(pkgPath, 'utf8');

	try {
		await cp(path.join(root, 'dist', pkg), stagedDist, { recursive: true });

		const pkgJson = JSON.parse(original) as PkgJson;
		rewriteWorkspaceDeps(pkgJson);
		rewriteExportsForPublish(pkgJson, pkg);
		writeFileSync(pkgPath, `${JSON.stringify(pkgJson, null, '\t')}\n`);

		console.log(`Publishing @ohJohny/theme-builder-${pkg}@${version}...`);
		execSync('npm publish', {
			cwd: pkgDir,
			stdio: 'inherit',
			env: { ...process.env },
		});
	} finally {
		writeFileSync(pkgPath, original);
		await rm(stagedDist, { recursive: true, force: true });
	}
}
