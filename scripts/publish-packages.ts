/**
 * Publishes @ohJohny/theme-builder from the repo root to GitHub Packages.
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rootPkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8')) as {
	name: string;
	version: string;
};

console.log(`Publishing ${rootPkg.name}@${rootPkg.version}...`);
execSync('npm publish', {
	cwd: root,
	stdio: 'inherit',
	env: { ...process.env },
});
