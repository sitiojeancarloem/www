import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {chromium} from 'playwright';
import sharp from 'sharp';
import qr from '../assets/jcem/lib/qrcode-generator/2.0.4/qrcode.mjs';
import {getDonationQrSpec} from '../assets/jcem/js/donations-qr.js';
import {createDonationQrForSymbol} from '../assets/jcem/js/donations-qr-symbol.js';
const root=fileURLToPath(new URL('../',import.meta.url)), file=(p:string)=>path.join(root,p);
const decode=createRequire(import.meta.url)('./vendor/jsqr/1.4.0/jsQR.cjs');
fs.mkdirSync(file('tmp'),{recursive:true});
const dir=fs.mkdtempSync(file('tmp/ft107-composed-test-'));
const browser=await chromium.launch({executablePath:'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',headless:true,env:{...process.env,TEMP:dir,TMP:dir}});
try {
  const page=await browser.newPage();
  const geom='data:text/javascript;base64,'+fs.readFileSync(file('assets/jcem/js/donations-qr-geometry.js')).toString('base64');
  const source=fs.readFileSync(file('assets/jcem/js/donations-qr-canvas.js'),'utf8').replaceAll('./donations-qr-geometry.js',geom);
  await page.evaluate(async s=>{globalThis.renderer=await import('data:text/javascript;base64,'+s)},Buffer.from(source).toString('base64'));
  const logo=fs.readFileSync(file('assets/jcem/img/logo-animado.gif')).toString('base64');
  let count=0;
  for(const method of JSON.parse(fs.readFileSync(file('_data/donations.json'),'utf8')).methods) {
    const spec=getDonationQrSpec(method,'https://www.jeancarloem.com'); if(!spec) continue;
    const q=createDonationQrForSymbol(spec.payload,qr);
    const output=await page.evaluate(async ({q,caption,logo})=>{
      const c=document.createElement('canvas'),ctx=c.getContext('2d',{willReadFrequently:true});
      if(!ctx)throw Error('Canvas ausente');
      globalThis.renderer.renderDonationQrBase(c,q.matrix,caption);
      const base=ctx.getImageData(0,0,c.width,c.height).data;
      const bitmap=await createImageBitmap(new Blob([Uint8Array.from(atob(logo),s=>s.charCodeAt(0))],{type:'image/gif'}));
      try {globalThis.renderer.renderDonationQrWithSymbol(c,q.matrix,caption,bitmap,q.symbolArea);} finally {bitmap.close();}
      const after=ctx.getImageData(0,0,c.width,c.height).data,a=q.symbolArea,left=48+a.x*8,top=48+a.y*8,side=a.size*8;
      let outside=0,inside=0;
      for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++) {
        const i=(y*c.width+x)*4,changed=[0,1,2,3].some(k=>base[i+k]!==after[i+k]);
        if(changed) {if(x>=left&&x<left+side&&y>=top&&y<top+side)inside++;else outside++;}
      }
      return {png:c.toDataURL('image/png'),outside,inside,readFrequently:ctx.getContextAttributes().willReadFrequently};
    },{q,caption:spec.caption,logo});
    assert.equal(output.readFrequently,true);
    assert.equal(output.outside,0,method.id); assert.ok(output.inside>0,method.id);
    const png=Buffer.from(output.png.split(',')[1],'base64');
    fs.writeFileSync(path.join(dir,method.id+'.png'),png,{flag:'wx'});
    const {data,info}=await sharp(png).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    const decoded=decode(new Uint8ClampedArray(data),info.width,info.height);
    assert.ok(decoded,'decode '+method.id);
    assert.deepEqual(Buffer.from(decoded.binaryData),Buffer.from(spec.payload,'utf8'),method.id);
    console.log(JSON.stringify({id:method.id,outside:output.outside,inside:output.inside,width:info.width,height:info.height}));
    count++;
  }
  assert.equal(count,5); console.log('COMPOSED_QR_BYTE_EXACT_OUTSIDE_PRESERVED_OK evidence='+dir);
} finally {await browser.close();}
