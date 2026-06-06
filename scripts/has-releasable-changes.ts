/**
 * Prints "true" when HEAD contains changes beyond the last release that warrant CI/publish.
 * Prints "false" for merge syncs, version-only manifest edits, and other no-op pushes.
 */
import { execSync } from 'node:child_process';

function git(args: string): string {
	try {
		return execSync(`git ${args}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
	} catch {
		return '';
	}
}

function isManifestPath(file: string): boolean {
	return file === 'package.json' || /^packages\/[^/]+\/package\.json$/.test(file);
}

function hasReleasableChanges(): boolean {
	const lastTag = git('describe --tags --abbrev=0');
	const lastRelease = git("log -1 --format=%H --grep='^chore: release v'");
	const base = lastTag || lastRelease;

	if (!base) {
		return true;
	}

	if (git(`rev-parse ${base}^{tree}`) === git('rev-parse HEAD^{tree}')) {
		return false;
	}

	const changedFiles = git(`diff --name-only ${base}..HEAD`).split('\n').filter(Boolean);
	if (changedFiles.length === 0) {
		return false;
	}

	if (!changedFiles.every(isManifestPath)) {
		return true;
	}

	const diff = git(`diff ${base}..HEAD -- ${changedFiles.join(' ')}`);
	const meaningfulLines = diff
		.split('\n')
		.filter(
			(line) =>
				(line.startsWith('+') || line.startsWith('-')) &&
				!line.startsWith('+++') &&
				!line.startsWith('---'),
		)
		.filter((line) => !/^[+-]\s*"version":/.test(line));

	return meaningfulLines.length > 0;
}

console.log(hasReleasableChanges() ? 'true' : 'false');
