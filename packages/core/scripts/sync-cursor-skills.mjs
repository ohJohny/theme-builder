/**
 * Postinstall: copy this package's skills into the installer's `.cursor/skills/`.
 */
import { access, cp, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectRoot = process.env.INIT_CWD || process.cwd();

async function exists(filePath) {
	try {
		await access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function resolveSkillsDir() {
	const repoRoot = path.resolve(pkgRoot, '../..');
	const candidates = [
		path.join(pkgRoot, 'skills'),
		path.join(pkgRoot, 'dist', 'skills'),
		path.join(repoRoot, 'dist', 'core', 'skills'),
	];
	for (const candidate of candidates) {
		if (await exists(candidate)) {
			return candidate;
		}
	}
	return null;
}

const skillsDir = await resolveSkillsDir();
if (!skillsDir) {
	process.exit(0);
}

const entries = await readdir(skillsDir, { withFileTypes: true });

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
}
