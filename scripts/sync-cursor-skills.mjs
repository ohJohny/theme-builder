/**
 * Copies package SKILL.md trees into the project root `.cursor/skills/`.
 *
 * Usage:
 *   node scripts/sync-cursor-skills.mjs              # all workspace packages
 *   node scripts/sync-cursor-skills.mjs packages/react
 */
import { access, cp, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..');
const projectRoot = process.env.INIT_CWD || repoRoot;

async function exists(filePath) {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function resolveSkillsDir(pkgDir) {
	for (const relative of ['dist/skills', 'skills']) {
		const candidate = path.join(pkgDir, relative);
		if (await exists(candidate)) {
			return candidate;
		}
	}
	return null;
}

async function syncPackage(pkgDir) {
	const skillsDir = await resolveSkillsDir(pkgDir);
	if (!skillsDir) {
		return 0;
	}

	const entries = await readdir(skillsDir, { withFileTypes: true });
	let copied = 0;

	for (const entry of entries) {
		if (!entry.isDirectory()) {
			continue;
		}

		const skillFile = path.join(skillsDir, entry.name, 'SKILL.md');
		if (!(await exists(skillFile))) {
			continue;
		}

		const destDir = path.join(projectRoot, '.cursor', 'skills', entry.name);
		await mkdir(destDir, { recursive: true });
		await cp(path.join(skillsDir, entry.name), destDir, { recursive: true, force: true });
		copied += 1;
	}

	return copied;
}

async function syncAll() {
	const packagesDir = path.join(repoRoot, 'packages');
	const names = await readdir(packagesDir);
	let total = 0;

	for (const name of names) {
		const pkgDir = path.join(packagesDir, name);
		total += await syncPackage(pkgDir);
	}

	return total;
}

const target = process.argv[2];
const count = target
	? await syncPackage(path.isAbsolute(target) ? target : path.join(repoRoot, target))
	: await syncAll();

if (count > 0) {
	console.log(`cursor-skills: synced ${count} skill(s) to ${path.join(projectRoot, '.cursor', 'skills')}`);
}
