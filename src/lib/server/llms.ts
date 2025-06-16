import { topics } from '$lib/data/topics';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Import all markdown files using Vite's ?raw imports
import about from '../../copy/about.md?raw';
import api_reference from '../../copy/api-reference.md?raw';
import best_practices from '../../copy/best-practices.md?raw';
import ci_cd from '../../copy/ci-cd.md?raw';
import e2e_testing from '../../copy/e2e-testing.md?raw';
import getting_started from '../../copy/getting-started.md?raw';
import migration_guide from '../../copy/migration-guide.md?raw';
import testing_patterns from '../../copy/testing-patterns.md?raw';
import troubleshooting from '../../copy/troubleshooting.md?raw';

export { topics };

// Content map using the imported markdown
const content_map: Record<string, string> = {
	'getting-started': getting_started,
	'testing-patterns': testing_patterns,
	'e2e-testing': e2e_testing,
	'api-reference': api_reference,
	'migration-guide': migration_guide,
	'best-practices': best_practices,
	'ci-cd': ci_cd,
	troubleshooting: troubleshooting,
	about: about,
};

// Function to load full content from preloaded markdown (no async needed!)
export function load_full_content(): string {
	let content = '# Sveltest Testing Documentation\n\n';
	content +=
		'> Comprehensive vitest-browser-svelte testing patterns for modern Svelte 5 applications. Real-world examples demonstrating client-server alignment, component testing in actual browsers, SSR validation, and migration from @testing-library/svelte.\n\n';

	for (const topic of topics) {
		const md_content = content_map[topic.slug];
		if (md_content) {
			content += `\n# ${topic.title}\n\n`;
			content += md_content;
			content += '\n';
		} else {
			console.warn(`No content found for topic: ${topic.slug}`);
		}
	}

	return content;
}

// Load prompts from markdown files (for server-side use)
async function loadPrompts(): Promise<Record<string, string>> {
	const variants = [
		'llms',
		'llms-medium',
		'llms-small',
		'llms-api',
		'llms-examples',
		'llms-ctx',
	];
	const prompts: Record<string, string> = {};

	for (const variant of variants) {
		try {
			const promptPath = join(
				process.cwd(),
				'prompts',
				`${variant}.md`,
			);
			prompts[variant] = await readFile(promptPath, 'utf-8');
		} catch (error) {
			console.warn(`Could not load prompt for ${variant}:`, error);
		}
	}

	return prompts;
}

// Export the function for runtime loading
export async function getVariantPrompts() {
	return await loadPrompts();
}
