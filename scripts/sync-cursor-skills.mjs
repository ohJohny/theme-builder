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

async function syncPackage(pkgDir) {
	const sourceSkillsDir = path.join(pkgDir, 'skills');
	if (!(await exists(sourceSkillsDir))) {
		return 0;
	}

	const entries = await readdir(sourceSkillsDir, { withFileTypes: true });
	let copied = 0;

	for (const entry of entries) {
		if (!entry.isDirectory()) {
			continue;
		}

		const skillFile = path.join(sourceSkillsDir, entry.name, 'SKILL.md');
		if (!(await exists(skillFile))) {
			continue;
		}

		const destDir = path.join(projectRoot, '.cursor', 'skills', entry.name);
		await mkdir(destDir, { recursive: true });
		await cp(path.join(sourceSkillsDir, entry.name), destDir, { recursive: true, force: true });
		copied += 1;
	}

	return copied;
}

async function syncFromRootDist() {
	const skillsDir = path.join(repoRoot, 'dist', 'theme-builder', 'skills');
	if (!(await exists(skillsDir))) {
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
	let total = 0;

	if (await exists(packagesDir)) {
		const names = await readdir(packagesDir);
		for (const name of names) {
			const pkgDir = path.join(packagesDir, name);
			total += await syncPackage(pkgDir);
		}
	}

	if (total > 0) {
		return total;
	}

	return syncFromRootDist();
}

const target = process.argv[2];
const count = target
	? await syncPackage(path.isAbsolute(target) ? target : path.join(repoRoot, target))
	: await syncAll();

if (count > 0) {
	console.log(`cursor-skills: synced ${count} skill(s) to ${path.join(projectRoot, '.cursor', 'skills')}`);
}
