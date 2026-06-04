import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, '..');
const repoRoot = path.resolve(pkgRoot, '../..');
const distSkills = path.join(repoRoot, 'dist', 'core', 'skills');

await mkdir(distSkills, { recursive: true });
await cp(path.join(pkgRoot, 'skills'), distSkills, { recursive: true });
