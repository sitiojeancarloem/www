import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import qrcode from '../assets/jcem/lib/qrcode-generator/2.0.4/qrcode.mjs';
import {stringToBytes} from '../assets/jcem/lib/qrcode-generator/2.0.4/qrcode_UTF8.mjs';
import {getDonationQrSpec,createDonationQrMatrix} from '../assets/jcem/js/donations-qr.js';
qrcode.stringToBytes=stringToBytes;
const decode=createRequire(import.meta.url)('./vendor/jsqr/1.4.0/jsQR.cjs');
const methods=JSON.parse(fs.readFileSync(new URL('../_data/donations.json',import.meta.url),'utf8')).methods;
const before=structuredClone(methods);
let count=0;
for(const method of methods) {
  const spec=getDonationQrSpec(method,'https://www.example.org/path?q=1#part');
  if(method.type==='paypal') { assert.equal(spec,null); continue; }
  assert.ok(spec);
  assert.equal(spec.payload,method.type==='pix'?method.payload:method.address);
  assert.equal(spec.caption,method.type==='pix'?'PIX: '+method.key:method.symbol.toUpperCase()+' | example.org');
  const matrix=createDonationQrMatrix(spec.payload,qrcode), n=matrix.length, scale=5, width=(n+8)*scale;
  const rgba=new Uint8ClampedArray(width*width*4).fill(255);
  for(let y=0;y<n;y++) for(let x=0;x<n;x++) if(matrix[y][x]) {
    for(let dy=0;dy<scale;dy++) for(let dx=0;dx<scale;dx++) {
      const i=(((y+4)*scale+dy)*width+(x+4)*scale+dx)*4;
      rgba[i]=rgba[i+1]=rgba[i+2]=0;
    }
  }
  const result=decode(rgba,width,width);
  assert.ok(result,'decode: '+method.id);
  assert.deepEqual(Buffer.from(result.binaryData),Buffer.from(spec.payload,'utf8'),method.id);
  count++;
}
assert.equal(count,5);
assert.deepEqual(methods,before);
let calls=0;
assert.throws(()=>createDonationQrMatrix('',()=>{calls++;throw Error('não chamar');}));
assert.equal(calls,0);
console.log('FIVE_REAL_QR_MATRICES_DECODE_BYTE_EXACT_OK');
