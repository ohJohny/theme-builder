/**
 * Rewrites framework bundle types to use umbrella core imports for consumers.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const coreImport = '@ohJohny/theme-builder-core';
const umbrellaCoreTypes = '@ohJohny/theme-builder/core';

async function walkFiles(dir, onFile) {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const filePath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			await walkFiles(filePath, onFile);
			continue;
		}
		onFile(filePath);
	}
}

function rewriteTypes(filePath) {
	let content = readFileSync(filePath, 'utf8');
	if (!content.includes(coreImport)) return;
	content = content.replaceAll(coreImport, umbrellaCoreTypes);
	writeFileSync(filePath, content);
}

for (const framework of ['react', 'solid']) {
	await walkFiles(path.join(distDir, framework, 'types'), (filePath) => {
		if (filePath.endsWith('.d.ts')) {
			rewriteTypes(filePath);
		}
	});
}
