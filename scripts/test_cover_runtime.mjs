import assert from 'node:assert/strict';

import { resolveJcemLegacyHeroMode } from '../assets/jcem/js/cover-layout.js';

const image = { imageWidth: 1920, imageHeight: 1002 };

const fitting = resolveJcemLegacyHeroMode({
	...image,
	viewportWidth: 1280,
	viewportHeight: 900,
	heroTopAtScrollZero: 80,
});
assert.equal(fitting.mode, 'full', 'hero que cabe nao permaneceu integral');
assert.equal(fitting.availableHeight, 820);

const overflowing = resolveJcemLegacyHeroMode({
	...image,
	viewportWidth: 2560,
	viewportHeight: 1080,
	heroTopAtScrollZero: 80,
});
assert.equal(overflowing.mode, 'content', 'hero alto nao alternou para content');
assert.ok(overflowing.projectedFullHeight > overflowing.availableHeight);

const boundary = resolveJcemLegacyHeroMode({
	imageWidth: 2,
	imageHeight: 1,
	viewportWidth: 1600,
	viewportHeight: 900,
	heroTopAtScrollZero: 100,
});
assert.equal(boundary.mode, 'full', 'limiar exato oscilou para content');

const stableInputs = Array.from({ length: 20 }, () => ({
	...image,
	viewportWidth: 2560,
	viewportHeight: 1080,
	heroTopAtScrollZero: 80,
}));
assert.deepEqual(
	stableInputs.map((measurement) => resolveJcemLegacyHeroMode(measurement).mode),
	Array(20).fill('content'),
	'decisao identica oscilou entre modos',
);

const scrolledEquivalent = resolveJcemLegacyHeroMode({
	...image,
	viewportWidth: 2560,
	viewportHeight: 1080,
	heroTopAtScrollZero: 80,
});
assert.deepEqual(scrolledEquivalent, overflowing, 'decisao incorporou estado de scroll');

console.log('cover_runtime=ok states=2 stable=20 scroll=independent');
