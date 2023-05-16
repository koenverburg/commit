const {
	group,
	intro,
	outro,
	text,
	select,
	multiselect,
	confirm,
	cancel,
} = require('@clack/prompts');
const {spawnSync} = require('child_process');

async function main() {
	intro('Commit');
	const r = await group(
		{
			type: () =>
				select({
					message: 'Whats the type of change?',
					options: [
						{value: 'chore', label: 'chore'},
						{value: 'ci', label: 'ci'},
						{value: 'docs', label: 'docs'},
						{value: 'feat', label: 'feat'},
						{value: 'fix', label: 'fix'},
						{value: 'k8s', label: 'k8s'},
						{value: 'program', label: 'program'},
						{value: 'refactor', label: 'refactor'},
						{value: 'revert', label: 'revert'},
						{value: 'style', label: 'style'},
						{value: 'tests', label: 'tests'},
					],
				}),
			scope: () =>
				text({
					message: 'Whats the scope of the change?',
					placeholder: '',
					initialValue: '',
					validate(value) {
						if (value.length === 0) return `Value is required!`;
					},
				}),
			subject: () =>
				text({
					message: 'Summarize your changes?',
					placeholder: '',
					initialValue: '',
					validate(value) {
						if (value.length === 0) return `Value is required!`;
					},
				}),
			tags: () =>
				multiselect({
					message: 'Any closing tags?',
					options: [
						{value: '#WIP', label: 'wip'},
						{value: '[skip ci]', label: 'skip ci'},
					],
					required: false,
				}),
			commitBoolean: ({ results: r }) =>
				confirm({
					message: `Looks good?: ${r.type}(${r.scope}) ${r.subject} ${r.tags}`,
				}),
		},
		{
			// On Cancel callback that wraps the group
			// So if the user cancels one of the prompts in the group this function will be called
			onCancel: ({results}) => {
				cancel('Operation cancelled.');
				process.exit(0);
			},
		},
	);

	const commitMessage = `${r.type}(${r.scope}) ${r.subject} ${r.tags}`;
	// console.log(commitMessage);

	if (r.commitBoolean) {
		spawnSync('git', ['commit', '-m', commitMessage], {
			cwd: __dirname,
			encoding: 'utf8',
		});
		// console.log(stdout);
	}

	outro('Lets ship it!')
}

main();
