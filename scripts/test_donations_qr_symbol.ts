import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import qr from '../assets/jcem/lib/qrcode-generator/2.0.4/qrcode.mjs';
import {createDonationQrForSymbol} from '../assets/jcem/js/donations-qr-symbol.js';
import {getQrFunctionalMask} from '../assets/jcem/js/donations-qr-geometry.js';
import {getDonationQrSpec} from '../assets/jcem/js/donations-qr.js';
const decode=createRequire(import.meta.url)('./vendor/jsqr/1.4.0/jsQR.cjs');
let count=0;
for(const method of JSON.parse(fs.readFileSync(new URL('../_data/donations.json',import.meta.url),'utf8')).methods) {
  const spec=getDonationQrSpec(method,'https://www.jeancarloem.com');
  if(!spec) continue;
  const calls:number[]=[];
  const result=createDonationQrForSymbol(spec.payload,(v:number,e:'H')=>{calls.push(v);assert.equal(e,'H');return qr(v,e);});
  const area=result.symbolArea,n=result.matrix.length,mask=getQrFunctionalMask(n);
  assert.equal(n,17+4*result.version);
  assert.equal(calls[0],0);
  assert.ok(calls.length<=41);
  assert.equal(new Set(calls).size,calls.length);
  for(let i=2;i<calls.length;i++) assert.equal(calls[i],calls[i-1]+1);
  for(let y=area.y;y<area.y+area.size;y++) for(let x=area.x;x<area.x+area.size;x++) assert.equal(mask[y][x],false);
  const scale=5,width=(n+8)*scale,rgba=new Uint8ClampedArray(width*width*4).fill(255);
  for(let y=0;y<n;y++) for(let x=0;x<n;x++) {
    const reserved=y>=area.y&&y<area.y+area.size&&x>=area.x&&x<area.x+area.size;
    if(result.matrix[y][x]&&!reserved) for(let dy=0;dy<scale;dy++) for(let dx=0;dx<scale;dx++) {
      const i=(((y+4)*scale+dy)*width+(x+4)*scale+dx)*4;
      rgba[i]=rgba[i+1]=rgba[i+2]=0;
    }
  }
  const decoded=decode(rgba,width,width);
  assert.ok(decoded,method.id);
  assert.deepEqual(Buffer.from(decoded.binaryData),Buffer.from(spec.payload,'utf8'),method.id);
  console.log(JSON.stringify({id:method.id,version:result.version,symbolArea:area,calls}));
  count++;
}
assert.equal(count,5);
console.log('FIVE_RESERVED_CENTER_QRS_DECODE_BYTE_EXACT_OK');
