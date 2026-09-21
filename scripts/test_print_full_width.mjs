import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	analyzeImageBuffer,
	classifyGeometry,
	runAnalysis,
} from './analyze-print-full-width.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const configuration = JSON.parse(await readFile(path.join(root, 'config', 'print-full-width.json'), 'utf8'));
const profile = JSON.parse(
	await readFile(
		path.join(root, 'src', 'jcem-print-ieee', 'profiles', 'ieee-conference-a4-ieeetran-1.8b.json'),
		'utf8',
	),
);

const svg = ({ width = 1200, height = 360, content = '' }) => Buffer.from(
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${content}</svg>`,
);
const denseText = Array.from({ length: 6 }, (_, index) =>
	`<text x="${30 + index * 180}" y="${80 + (index % 2) * 120}">Rótulo técnico ${index + 1}</text>`,
).join('');
const denseVisual = Array.from({ length: 24 }, (_, index) =>
	`<line x1="${index * 45}" y1="20" x2="${1200 - index * 20}" y2="340"/>`,
).join('');

const textAnalysis = await analyzeImageBuffer({
	buffer: svg({ content: denseText }),
	extension: '.svg',
	configuration,
	profile,
});
assert.equal(textAnalysis.autoFullWidth, true);
assert.equal(textAnalysis.evidence.text, true);
assert.equal(textAnalysis.reason, 'geometry-and-text-density');

const visualAnalysis = await analyzeImageBuffer({
	buffer: svg({ content: denseVisual }),
	extension: '.svg',
	configuration,
	profile,
});
assert.equal(visualAnalysis.autoFullWidth, true);
assert.equal(visualAnalysis.evidence.visual, true);
assert.equal(visualAnalysis.reason, 'geometry-and-visual-density');

const simpleAnalysis = await analyzeImageBuffer({
	buffer: svg({ content: '<rect width="1200" height="360"/><circle cx="600" cy="180" r="80"/>' }),
	extension: '.svg',
	configuration,
	profile,
});
assert.equal(simpleAnalysis.autoFullWidth, false);
assert.equal(simpleAnalysis.reason, 'information-density-insufficient');

const nearLimit = classifyGeometry(
	{ width: 1200, height: 544 },
	profile,
	configuration.geometry.maximumUsableHeightRatio,
);
const aboveLimit = classifyGeometry(
	{ width: 1200, height: 546 },
	profile,
	configuration.geometry.maximumUsableHeightRatio,
);
assert.equal(nearLimit.eligible, true);
assert.equal(aboveLimit.eligible, false);

const overHeight = await analyzeImageBuffer({
	buffer: svg({ height: 700, content: denseText }),
	extension: '.svg',
	configuration,
	profile,
});
assert.equal(overHeight.autoFullWidth, false);
assert.equal(overHeight.reason, 'geometry-rejected');

const deterministic = await analyzeImageBuffer({
	buffer: svg({ content: denseText }),
	extension: '.svg',
	configuration,
	profile,
});
assert.deepEqual(deterministic, textAnalysis);

const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'jcem-print-full-width-'));
await Promise.all([
	mkdir(path.join(temporaryRoot, 'config'), { recursive: true }),
	mkdir(path.join(temporaryRoot, 'profiles'), { recursive: true }),
	mkdir(path.join(temporaryRoot, '_pages'), { recursive: true }),
	mkdir(path.join(temporaryRoot, 'assets', 'images', 'fixtures'), { recursive: true }),
]);
await Promise.all([
	writeFile(path.join(temporaryRoot, 'config', 'classifier.json'), JSON.stringify(configuration)),
	writeFile(path.join(temporaryRoot, 'profiles', 'profile.json'), JSON.stringify(profile)),
	writeFile(
		path.join(temporaryRoot, '_pages', 'fixture.md'),
		'![Diagrama](/assets/images/fixtures/dense.svg)\n',
	),
	writeFile(path.join(temporaryRoot, 'assets', 'images', 'fixtures', 'dense.svg'), svg({ content: denseText })),
]);
const runOptions = {
	repositoryRoot: temporaryRoot,
	configPath: 'config/classifier.json',
	profilePath: 'profiles/profile.json',
	cachePath: 'cache/cache.json',
	outputPath: '_data/manifest.json',
};
const firstRun = await runAnalysis(runOptions);
const secondRun = await runAnalysis(runOptions);
assert.deepEqual({ analyzed: firstRun.analyzed, cacheHits: firstRun.cacheHits }, { analyzed: 1, cacheHits: 0 });
assert.deepEqual({ analyzed: secondRun.analyzed, cacheHits: secondRun.cacheHits }, { analyzed: 0, cacheHits: 1 });
await writeFile(
	path.join(temporaryRoot, 'assets', 'images', 'fixtures', 'dense.svg'),
	svg({ content: `${denseText}<text x="30" y="330">alterado</text>` }),
);
const changedRun = await runAnalysis(runOptions);
assert.deepEqual({ analyzed: changedRun.analyzed, cacheHits: changedRun.cacheHits }, { analyzed: 1, cacheHits: 0 });

process.stdout.write('print_full_width=ok vectors=5 cache=hit+invalidate deterministic=true\n');
