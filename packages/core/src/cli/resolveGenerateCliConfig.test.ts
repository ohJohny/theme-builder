import { afterEach, describe, expect, it } from 'vitest';

import { resolveGenerateCliConfig } from './resolveGenerateCliConfig';

describe('resolveGenerateCliConfig lint defaults', () => {
	const originalArgv = process.argv;

	afterEach(() => {
		process.argv = originalArgv;
	});

	it('enables lintA11y by default', () => {
		process.argv = ['node', 'theme-builder'];
		expect(resolveGenerateCliConfig().lintA11y).toBe(true);
	});

	it('disables lintA11y with --no-lint-a11y', () => {
		process.argv = ['node', 'theme-builder', '--no-lint-a11y'];
		expect(resolveGenerateCliConfig().lintA11y).toBe(false);
	});

	it('keeps strictA11y opt-in', () => {
		process.argv = ['node', 'theme-builder'];
		expect(resolveGenerateCliConfig().strictA11y).toBe(false);

		process.argv = ['node', 'theme-builder', '--strict-a11y'];
		expect(resolveGenerateCliConfig().strictA11y).toBe(true);
	});
});
