// JeanCarloEM — MPL-2.0. Invariantes do formato: https://www.jsdelivr.com/documentation
// Sem rede; fixtures de URL não afirmam existência/licença de assets externos.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {getDonationAssetSources as sources} from '../assets/jcem/js/donations-asset-sources.js';
const data=JSON.parse(fs.readFileSync('_data/donations.json','utf8')),before=JSON.stringify(data);let cases=0;
function positive(asset){
 const frozenBefore=Object.isFrozen(asset),list=sources(asset);assert.equal(list.length,2);assert.deepEqual(list.map(s=>s.id),['primary','jsdelivr']);
 assert.equal(list[0].url,asset.source);assert.ok(Object.isFrozen(list));assert.ok(list.every(Object.isFrozen));
 const input=new URL(asset.source),output=new URL(list[1].url),parts=input.pathname.slice(1).split('/');
 assert.equal(output.origin,'https://cdn.jsdelivr.net');assert.equal(output.search,'');assert.equal(output.hash,'');
 const inverse=output.pathname.match(/^\/gh\/([^/]+)\/([^@/]+)@([^/]+)\/(.+)$/);assert.ok(inverse);
 assert.equal(inverse[1],parts[0]);assert.equal(inverse[2],parts[1]);assert.equal(inverse[3],parts[2]);assert.equal(inverse[4],parts.slice(3).join('/'));
 assert.equal(Object.isFrozen(asset),frozenBefore);assert.throws(()=>list.push(list[0]));assert.throws(()=>{list[0].url='https://example.test/';});cases++;
}
for(const asset of data.assets)positive(asset);
const seed=data.assets[0],pin='a'.repeat(40),prefix='https://raw.githubusercontent.com/a/repo/';
for(const source of [prefix+pin+'/icons/a.png','https://raw.githubusercontent.com/a/repo.name/v1.2.3/icons/a_b.png'])positive({...seed,source});
const invalid=[
 'http://raw.githubusercontent.com/a/repo/'+pin+'/a.png',
 'https://cdn.jsdelivr.net/gh/a/repo@'+pin+'/a.png',
 'https://raw.githubusercontent.com.evil.test/a/repo/'+pin+'/a.png',
 'https://u:p@raw.githubusercontent.com/a/repo/'+pin+'/a.png',
 'https://raw.githubusercontent.com:8443/a/repo/'+pin+'/a.png',
 prefix+'main/a.png',prefix+'latest/a.png',prefix+'1.2/a.png',prefix+'^1.2.3/a.png',prefix+pin.slice(0,12)+'/a.png',
 prefix+pin+'/a.png?x=1',prefix+pin+'/a.png#x',prefix+pin+'/a.png?',prefix+pin+'/a.png#',
 prefix+pin+'/icons/../a.png',prefix+pin+'/icons/./a.png',prefix+pin+'/icons//a.png',prefix+pin+'/',
 prefix+pin+'/%2e%2e/a.png',prefix+pin+'/a%2fb.png',prefix+pin+'/a b.png',prefix+pin+'/a\\b.png',prefix+pin+'/a\nb.png',
 'https://raw.githubusercontent.com/a/../'+pin+'/a.png'
];
for(const source of invalid){assert.throws(()=>sources({...seed,source}),source);cases++;}
assert.throws(()=>sources({...seed,sha256:'bad'}));cases++;assert.equal(JSON.stringify(data),before);
console.log('DONATION_ASSET_SOURCE_PLAN_CANONICAL_PINS_INVERSE_MAPPING_IMMUTABILITY_AND_NEGATIVES_OK cases='+cases);
