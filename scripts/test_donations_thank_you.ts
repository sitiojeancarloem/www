import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {validateDonationThankYou} from '../assets/jcem/js/donations-thank-you.js';
import {validateDonationsData} from '../assets/jcem/js/donations-data.js';
const allData=JSON.parse(fs.readFileSync(new URL('../_data/donations.json',import.meta.url),'utf8'));
const rootSnapshot=structuredClone(allData);const original=allData.thankYou;
const rcf=fs.readFileSync(new URL('../RCFs/doacoes.md',import.meta.url),'utf8');assert.ok(rcf.includes('título normal `Obrigado`'));assert.equal(original.title,'Obrigado');
const provenance=JSON.parse(fs.readFileSync(new URL('../.ia.rules/state/requests/FT-106/agradecimento-imagegen.json',import.meta.url),'utf8'));
for(const p of [original.image.src,original.cover.patterns.left,original.cover.patterns.right]){const asset=provenance.outputs.find(e=>'/'+e.path===p);assert.ok(asset);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL('../'+asset.path,import.meta.url))).digest('hex'),asset.sha256);}
function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}
const frozen=freeze(structuredClone(original)),before=structuredClone(frozen);validateDonationThankYou(frozen);assert.deepEqual(frozen,before);
validateDonationsData(freeze(structuredClone(allData)));
const legacy=structuredClone(allData);delete legacy.thankYou;const legacySnapshot=structuredClone(legacy);validateDonationsData(legacy);assert.deepEqual(legacy,legacySnapshot);
let rejected=0;
function reject(label,value){const snapshot=structuredClone(value);assert.throws(()=>validateDonationThankYou(value),undefined,label);if(value!==undefined)assert.throws(()=>validateDonationsData({...allData,thankYou:value}),undefined,label+' integrated');else validateDonationsData({...allData,thankYou:undefined});assert.deepEqual(value,snapshot,label+': mutated input');rejected++;}
for(const bad of [undefined,null,[],true,1,'x'])reject('root',bad);
reject('augmented root array',Object.assign([],structuredClone(original)));
for(const parts of [['image'],['cover'],['cover','patterns']]){const v=structuredClone(original);const parent=parts.slice(0,-1).reduce((o,k)=>o[k],v);parent[parts.at(-1)]=Object.assign([],parent[parts.at(-1)]);reject('augmented array '+parts.join('.'),v);}
const objects=[['image'],['cover'],['cover','patterns']];
for(const parts of objects)for(const bad of [undefined,null,[],true,'x']){const v=structuredClone(original);const parent=parts.slice(0,-1).reduce((o,k)=>o[k],v);parent[parts.at(-1)]=bad;reject(parts.join('.'),v);}
for(const parts of [['title'],['message'],['image','alt']])for(const bad of [undefined,null,3,'','   ','x'.repeat(4097),' '.repeat(4096)+'x']){const v=structuredClone(original);const parent=parts.slice(0,-1).reduce((o,k)=>o[k],v);parent[parts.at(-1)]=bad;reject(parts.join('.'),v);}
for(const [key,bad]of [['mode','content'],['composition','single'],['mode',null],['composition',{}]]){const v=structuredClone(original);v.cover[key]=bad;reject(key,v);}
const badPaths=['/assets/a.WEBP','/assets/a\t.webp','/assets/a.webp\n','/assets/a.webp\r','/assets/'+ 'a'.repeat(4096)+'.webp','/assets/a//b.webp','/assets//a.webp',undefined,null,0,'','   ','https://example.invalid/a.webp','//example.invalid/a.webp','data:image/svg+xml,test','javascript:alert(1)','/other/a.webp','assets/a.webp','/assets/../a.webp','/assets/./a.webp','/assets/a%2eb.webp','/assets/a\\b.webp','/assets/a.webp?q=1','/assets/a.webp#x','/assets/a.txt','/assets/a\n.webp'];
for(const parts of [['image','src'],['cover','patterns','left'],['cover','patterns','right']])for(const bad of badPaths){const v=structuredClone(original);const parent=parts.slice(0,-1).reduce((o,k)=>o[k],v);parent[parts.at(-1)]=bad;reject(parts.join('.'),v);}
for(const extension of ['png','webp','jpg','jpeg','svg']){const v=structuredClone(original);v.image.src='/assets/local/art-1.'+extension;validateDonationThankYou(v);}
assert.deepEqual(allData,rootSnapshot);console.log('DONATIONS_OPTIONAL_THANK_YOU_INTEGRATED_AND_BACKWARD_COMPATIBLE_NEGATIVE_CASES_OK='+rejected);
