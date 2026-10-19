import assert from 'node:assert/strict';
import {validateDonationAssets as validate, resolveDonationAsset as resolve} from '../assets/jcem/js/donations-assets.js';
// Fixture sintética: não declara licença ou integridade de nenhum asset publicado.
const item = {id:'shared',path:'/assets/icons/test.svg',source:'https://example.org/icon.svg',license:'fixture-only',sha256:'a'.repeat(64)};
const catalog = [item], before = JSON.stringify(catalog);
validate(catalog); validate([]);
for (const consumer of ['currency','network','provider']) assert.equal(resolve(catalog, 'shared'), item, consumer);
assert.equal(resolve(catalog,'missing'),null);
assert.equal(resolve(catalog,'constructor'),null);
assert.equal(JSON.stringify(catalog),before);
for (const bad of [null,{},[item,item],Array(1),Array(65).fill(item),[Object.create(item)]]) assert.throws(()=>validate(bad));
for (const path of ['https://example.org/a.svg','//host/a.svg','/assets/../a.svg','/assets/%2e/a.svg','/assets/a.svg?x','/assets/a.svg#x','/assets//a.svg','/assets/a\\b.svg']) assert.throws(()=>validate([{...item,path}]));
for (const source of ['http://example.org/a','https://u:p@example.org/a','https://example.org:8443/a','/relative']) assert.throws(()=>validate([{...item,source}]));
for (const key of ['id','license','sha256']) for (const val of ['',null,' ']) assert.throws(()=>validate([{...item,[key]:val}]));
assert.throws(()=>validate([{...item,sha256:'A'.repeat(64)}]));
assert.throws(()=>resolve(catalog,'../bad'));
console.log('ASSET_CATALOG_STRUCTURE_RESOLUTION_AND_REJECTIONS_OK');

const {readFileSync}=await import('node:fs');
const {createHash}=await import('node:crypto');
const realData=JSON.parse(readFileSync(new URL('../_data/donations.json',import.meta.url),'utf8'));
validate(realData.assets);
for(const asset of realData.assets){
 const bytes=readFileSync(new URL('..'+asset.path,import.meta.url));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);
 assert.equal(resolve(realData.assets,asset.id),asset);
}
assert.ok(readFileSync(new URL('../assets/jcem/img/donations/LICENSE.txt',import.meta.url),'utf8').includes('Copyright (c) 2018 Erik Thiart'));
console.log('PUBLISHED_ASSET_CATALOG_HASHES_OK='+realData.assets.length);
