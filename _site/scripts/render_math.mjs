import katex from 'katex';

const readStdin = async () => {
	const chunks = [];

	for await (const chunk of process.stdin) {
		chunks.push(chunk);
	}

	return Buffer.concat(chunks).toString('utf8');
};

const renderItem = (item) => {
	const tex = typeof item?.tex === 'string' ? item.tex : '';
	const displayMode = Boolean(item?.displayMode);

	try {
		return {
			html: katex.renderToString(tex, {
				displayMode,
				output: 'html',
				strict: false,
				throwOnError: false,
				trust: false,
			}),
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : String(error),
		};
	}
};

try {
	const payload = JSON.parse(await readStdin());
	const items = Array.isArray(payload?.items) ? payload.items : [];

	process.stdout.write(JSON.stringify({ items: items.map(renderItem) }));
} catch (error) {
	process.stderr.write(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
}
