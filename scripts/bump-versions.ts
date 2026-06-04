/**
 * Bumps version in all publishable packages (lockstep) and prints the new version.
 * Usage: bun run scripts/bump-versions.ts <major|minor|patch>
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const bump = process.argv[2];
if (!bump || !['major', 'minor', 'patch'].includes(bump)) {
	console.error('Usage: bun run scripts/bump-versions.ts <major|minor|patch>');
	process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packages = ['core', 'react', 'solid'] as const;

const corePkgPath = path.join(root, 'packages', 'core', 'package.json');
const corePkg = JSON.parse(readFileSync(corePkgPath, 'utf8')) as { version: string };
const [major, minor, patch] = corePkg.version.split('.').map(Number);

let nextMajor = major;
let nextMinor = minor;
let nextPatch = patch;

if (bump === 'major') {
	nextMajor += 1;
	nextMinor = 0;
	nextPatch = 0;
} else if (bump === 'minor') {
	nextMinor += 1;
	nextPatch = 0;
} else {
	nextPatch += 1;
}

const version = `${nextMajor}.${nextMinor}.${nextPatch}`;

for (const pkg of packages) {
	const pkgPath = path.join(root, 'packages', pkg, 'package.json');
	const pkgJson = JSON.parse(readFileSync(pkgPath, 'utf8')) as { version: string };
	pkgJson.version = version;
	writeFileSync(pkgPath, `${JSON.stringify(pkgJson, null, '\t')}\n`);
}

console.log(version);
