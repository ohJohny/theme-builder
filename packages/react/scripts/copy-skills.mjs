import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(here, '..');
await mkdir(path.join(pkgRoot, 'dist', 'skills'), { recursive: true });
await cp(path.join(pkgRoot, 'skills'), path.join(pkgRoot, 'dist', 'skills'), { recursive: true });
