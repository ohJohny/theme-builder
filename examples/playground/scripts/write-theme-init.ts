import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildColorSchemeInitScript } from '@ohJohny/theme-builder/core';

const PLAYGROUND_SCHEMES = ['light', 'dark', 'sepia'] as const;
const PLAYGROUND_STORAGE_KEY = 'playground-theme';

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public');
mkdirSync(outDir, { recursive: true });

const script = buildColorSchemeInitScript({
	schemes: PLAYGROUND_SCHEMES,
	defaultScheme: 'light',
	storage: { type: 'localStorage', key: PLAYGROUND_STORAGE_KEY },
});

writeFileSync(path.join(outDir, 'theme-init.js'), script, 'utf-8');
