import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../../..');
const dest = path.join(repoRoot, 'dist', 'theme-builder', 'skills');

await mkdir(dest, { recursive: true });

for (const pkg of ['core', 'react', 'solid']) {
	await cp(path.join(repoRoot, 'packages', pkg, 'skills'), dest, { recursive: true });
}
