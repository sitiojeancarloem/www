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

let rejectedCases = 0;
function rejectCase(label: string, edit: (data: any) => void) {
  const data = structuredClone(original);
  edit(data);
  const snapshot = structuredClone(data);
  assert.throws(() => validateDonationsData(data), Error, label);
  assert.deepEqual(data, snapshot, label + ': entrada alterada');
  rejectedCases++;
}
rejectCase('array vazio', d => { d.methods = []; });
rejectCase('array 65', d => { d.methods = Array.from({length:65}, (_, i) => ({...crypto, id:'item-' + i})); });
rejectCase('array esparso', d => { d.methods = new Array(1); });
rejectCase('tipo desconhecido', d => { d.methods[0].type = 'other'; });
rejectCase('ID repetido', d => { d.methods[1].id = d.methods[0].id; });
rejectCase('ID inseguro', d => { d.methods[0].id = '../other'; });
const fields = {pix:['id','label','key','payload'], crypto:['id','label','symbol','name','network','address'], paypal:['id','label','url','currency']};
for (const [type, keys] of Object.entries(fields)) {
  for (const key of keys) {
    rejectCase(type + '/' + key + '/ausente', d => { delete d.methods.find((m:any) => m.type === type)[key]; });
    for (const bad of ['', '   ', 'x'.repeat(4097)]) {
      rejectCase(type + '/' + key + '/string inválida', d => { d.methods.find((m:any) => m.type === type)[key] = bad; });
    }
  }
}
for (const minimum of [-1, NaN, Infinity]) {
  rejectCase('mínimo inválido', d => { d.methods.find((m:any) => m.type === 'paypal').minimumAmount = minimum; });
}
rejectCase('moeda inválida', d => { d.methods.find((m:any) => m.type === 'paypal').currency = 'brl'; });
rejectCase('modo inválido', d => { d.methods.find((m:any) => m.type === 'paypal').amountMode = 'fixed'; });
for (const badUrl of ['javascript:alert(1)','https://evil.invalid/donate/','https://user:pass@www.paypal.com/donate/','https://www.paypal.com:8443/donate/','https://www.paypal.com/donate/other']) {
  rejectCase('URL inválida', d => { d.methods.find((m:any) => m.type === 'paypal').url = badUrl; });
}
assert.deepEqual(original, before);
console.log('DONATIONS_CONTRACT_NEGATIVE_CASES_OK=' + rejectedCases);

const noCatalog=structuredClone(original);
delete noCatalog.assets;
validateDonationsData(noCatalog);
for(const invalid of [null,{},[{...original.assets[0],path:'/assets/../bad.png'}], [original.assets[0],original.assets[0]]]){
 const data={...structuredClone(original),assets:invalid};
 const snapshot=structuredClone(data);
 assert.throws(()=>validateDonationsData(data));
 assert.deepEqual(data,snapshot);
}
validateDonationsData({...structuredClone(original),assets:[]});
console.log('DONATIONS_OPTIONAL_CATALOG_VALIDATED_AND_BACKWARD_COMPATIBLE');
