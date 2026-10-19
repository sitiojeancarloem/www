import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateDonationsData} from '../assets/jcem/js/donations-data.js';

const original = JSON.parse(readFileSync(new URL('../_data/donations.json', import.meta.url), 'utf8'));
const before = structuredClone(original);
validateDonationsData(original);
assert.deepEqual(original, before);
const extended = structuredClone(original);
const crypto = extended.methods.find((m: {type: string}) => m.type === 'crypto');
assert.ok(crypto, 'fixture crypto ausente');
extended.methods.push({...crypto, id: 'extra-crypto'});
validateDonationsData(extended);
assert.equal(extended.methods.length, original.methods.length + 1);
assert.deepEqual(original, before);
assert.throws(() => validateDonationsData(null), Error);
assert.throws(() => validateDonationsData({...structuredClone(original), schemaVersion: 2}), Error);
console.log('DONATIONS_CONTRACT_BASE_EXTENSION_NULL_VERSION_OK');
