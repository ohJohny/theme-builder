/**
 * Prints semver bump level (major | minor | patch) from Conventional Commits
 * since the last git tag.
 */
import { execSync } from 'node:child_process';

function git(args: string): string {
	try {
		return execSync(`git ${args}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
	} catch {
		return '';
	}
}

const lastTag = git('describe --tags --abbrev=0');
const lastRelease = git("log -1 --format=%H --grep='^chore: release v'");
const range = lastTag
	? `${lastTag}..HEAD`
	: lastRelease
		? `${lastRelease}..HEAD`
		: '-1';
const log = git(`log ${range} --pretty=format:%B%x00`);

if (!log) {
	console.log('none');
	process.exit(0);
}

const messages = log
	.split('\0')
	.filter(Boolean)
	.filter((message) => !(message.split('\n')[0] ?? '').startsWith('Merge '));

if (messages.length === 0) {
	console.log('none');
	process.exit(0);
}

const breakingSubject = /^[a-zA-Z]+(?:\([^)]+\))?!:/;
const featSubject = /^feat(?:\([^)]+\))?:/;

let bump: 'major' | 'minor' | 'patch' = 'patch';

for (const message of messages) {
	if (/\bBREAKING CHANGE:/m.test(message) || breakingSubject.test(message)) {
		bump = 'major';
		break;
	}
	if (featSubject.test(message)) {
		bump = 'minor';
	}
}

console.log(bump);
