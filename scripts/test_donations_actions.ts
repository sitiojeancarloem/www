import fs from 'node:fs';
import assert from 'node:assert/strict';
import {getDonationCopyValue,shortenDonationAddress,copyDonationValue,getDonationQrBlob} from '../assets/jcem/js/donations-actions.js';
const methods=JSON.parse(fs.readFileSync(new URL('../_data/donations.json',import.meta.url),'utf8')).methods;
const before=structuredClone(methods);
let copied=0;
for(const method of methods) {
  if(method.type==='paypal') {assert.equal(getDonationCopyValue(method),null);await assert.rejects(()=>copyDonationValue(method,{writeText:async()=>{throw Error('não chamar');}}));continue;}
  const expected=method.type==='pix'?method.key:method.address;
  assert.equal(getDonationCopyValue(method),expected);
  assert.ok(Array.from(shortenDonationAddress(expected)).length<=10);
  await copyDonationValue(method,{writeText:async(value:string)=>{assert.equal(value,expected);copied++;}});
}
assert.equal(copied,5);assert.deepEqual(methods,before);
assert.equal(shortenDonationAddress('1234567890'),'1234567890');
assert.equal(shortenDonationAddress('12345678901'),'1234…78901');
assert.equal(Array.from(shortenDonationAddress('😀'.repeat(11))).length,10);
assert.throws(()=>shortenDonationAddress(''));
const pix=methods.find((m:any)=>m.type==='pix');
const failure=new Error('clipboard denied');
await assert.rejects(()=>copyDonationValue(pix,{writeText:async()=>{throw failure;}}),e=>e===failure);
const png=new Blob(['fixture'],{type:'image/png'});
assert.equal(await getDonationQrBlob({toBlob(cb:any,mime:string){assert.equal(mime,'image/png');cb(png);}} as any),png);
await assert.rejects(()=>getDonationQrBlob({toBlob(cb:any){cb(null);}} as any));
await assert.rejects(()=>getDonationQrBlob({toBlob(cb:any){cb(new Blob([],{type:'image/jpeg'}));}} as any));
await assert.rejects(()=>getDonationQrBlob({toBlob(){throw failure;}} as any),e=>e===failure);
console.log('FIVE_FULL_COPY_VALUES_SHORTENING_AND_PNG_ERRORS_OK');
