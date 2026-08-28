import assert from 'node:assert/strict';
import sharp from 'sharp';

const rgba = async (input) => {
	const image = input?.data && input?.raw ? sharp(input.data, { raw: input.raw }) : sharp(input);
	return image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
};

const edge = ({ data, info }, x) => {
	const result = Buffer.alloc(info.height * info.channels);
	for (let y = 0; y < info.height; y += 1) {
		const offset = (y * info.width + x) * info.channels;
		data.copy(result, y * info.channels, offset, offset + info.channels);
	}
	return result;
};

const validate = async (inputs) => {
	const [left, central, right] = await Promise.all(inputs.map(rgba));
	assert.equal(left.info.height, central.info.height, 'ALTURA_LEFT_CENTRAL_DIVERGENTE');
	assert.equal(right.info.height, central.info.height, 'ALTURA_RIGHT_CENTRAL_DIVERGENTE');
	assert.ok(edge(left, left.info.width - 1).equals(edge(central, 0)), 'JUNCAO_LEFT_CENTRAL_DIVERGENTE');
	assert.ok(edge(right, 0).equals(edge(central, central.info.width - 1)), 'JUNCAO_CENTRAL_RIGHT_DIVERGENTE');
	assert.ok(edge(left, 0).equals(edge(left, left.info.width - 1)), 'REPETICAO_LEFT_DESCONTINUA');
	assert.ok(edge(right, 0).equals(edge(right, right.info.width - 1)), 'REPETICAO_RIGHT_DESCONTINUA');
};

const fixture = (width, height, columns) => {
	const data = Buffer.alloc(width * height * 4);
	for (let y = 0; y < height; y += 1) {
		for (let x = 0; x < width; x += 1) {
			const color = columns[x];
			data.set(color, (y * width + x) * 4);
		}
	}
	return { data, raw: { width, height, channels: 4 } };
};

if (process.argv.includes('--self-test')) {
	const red = [210, 30, 30, 255];
	const blue = [30, 60, 210, 255];
	const green = [30, 180, 90, 255];
	await validate([
		fixture(3, 4, [red, green, red]),
		fixture(4, 4, [red, green, green, blue]),
		fixture(3, 4, [blue, green, blue]),
	]);
	let rejected = false;
	try {
		await validate([
			fixture(3, 4, [red, green, blue]),
			fixture(4, 4, [red, green, green, blue]),
			fixture(3, 4, [blue, green, blue]),
		]);
	} catch {
		rejected = true;
	}
	assert.equal(rejected, true, 'FIXTURE_DE_COSTURA_NAO_REJEITADA');
	console.log('cover_edges=ok self_test=2');
} else {
	const inputs = process.argv.slice(2);
	assert.equal(inputs.length, 3, 'USO: check-cover-edges.mjs LEFT CENTRAL RIGHT');
	await validate(inputs);
	console.log('cover_edges=ok');
}
