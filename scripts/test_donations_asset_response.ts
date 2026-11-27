// JeanCarloEM — MPL-2.0. Fixtures sintéticas não atribuem licença/identidade a assets publicados.
// Node24+; Node22.21 também verificado com --experimental-strip-types.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {validateDonationAssets} from '../assets/jcem/js/donations-assets.js';
import {verifyDonationAssetResponse as verify} from '../assets/jcem/js/donations-asset-response.js';
const root=fs.realpathSync('.');assert.equal(root.toLowerCase(),'d:\\trampo\\jeancarloem.com.blog');
const data=JSON.parse(fs.readFileSync('_data/donations.json','utf8'));
const originalData=JSON.stringify(data);validateDonationAssets(data.assets);
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');let cases=0;
async function check(asset,body,contentType,expected,maxBytes=body?.byteLength??100,status=200){
 const input=Object.freeze({...asset}),response=Object.freeze({status,contentType,body});
 const before=body instanceof Uint8Array?Buffer.from(body):null;
 const result=await verify(input,response,maxBytes);
 if(expected==='ok'){
  assert.equal(result.ok,true);assert.equal(result.sha256,asset.sha256);
  assert.equal(result.byteLength,body.byteLength);
  assert.equal(result.contentType,asset.path.endsWith('.png')?'image/png':asset.path.endsWith('.svg')?'image/svg+xml':asset.path.endsWith('.gif')?'image/gif':'image/webp');
 }else assert.deepEqual(result,{ok:false,reason:expected});
 if(before)assert.deepEqual(Buffer.from(body),before,'body mutated');assert.deepEqual(input,asset,'metadata mutated');cases++;
}
for(const asset of data.assets){const body=fs.readFileSync(path.join(root,asset.path.slice(1)));const mime=asset.path.endsWith('.png')?'image/png':'image/svg+xml';await check(asset,body,mime,'ok');}
const png=data.assets.find(a=>a.path.endsWith('.png')),body=fs.readFileSync(path.join(root,png.path.slice(1)));
for(const limit of [0,-1,0.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])await check(png,body,'image/png','invalid_limit',limit);
await check(png,body,'image/png','http_status',body.length,404);
await check(png,{},'image/png','invalid_body',body.length);
await check(png,new Uint8Array(),'image/png','size',body.length);
await check(png,body,'image/png','size',body.length-1);
await check({...png,path:'/assets/fixture.jpg'},body,'image/jpeg','unsupported_extension');
for(const mime of [null,'','text/html','text/plain','image/svg+xml'])await check(png,body,mime,'mime');
await check(png,body,' Image/PNG ; charset=binary ','ok');
const badMagic=Buffer.from(body);badMagic[0]^=1;
await check({...png,sha256:sha(badMagic)},badMagic,'image/png','signature');
const badHash=Buffer.from(body);badHash[badHash.length-1]^=1;await check(png,badHash,'image/png','hash');
const svg=data.assets.find(a=>a.path.endsWith('.svg')),svgBody=fs.readFileSync(path.join(root,svg.path.slice(1)));
for(const prefix of ['\uFEFF','<?xml version="1.0" encoding="UTF-8"?>\n','\uFEFF  <?xml version="1.0"?>\n']){
 const bytes=Buffer.concat([Buffer.from(prefix),svgBody]);await check({...svg,sha256:sha(bytes)},bytes,'IMAGE/SVG+XML; charset=utf-8','ok');
}
for(const bytes of [Buffer.from('<html></html>'),Buffer.from('<svgish></svgish>'),Buffer.from([60,115,118,103,62,255,60,47,115,118,103,62])])await check({...svg,sha256:sha(bytes)},bytes,'image/svg+xml','signature');
// Reais GIF/WebP já versionados: oráculo de bytes via fs + Node SHA, sem recadastrar hash da implementação.
for(const [file,mime]of [['assets/jcem/img/logo-animado.gif','image/gif'],['assets/images/doacoes/agradecimento-cover.webp','image/webp']]){
 const bytes=fs.readFileSync(file),fixture={id:'fixture',path:'/'+file,source:'https://example.test/fixture',license:'fixture-only',sha256:sha(bytes)};validateDonationAssets([fixture]);
 await check(fixture,bytes,mime,'ok');const corrupt=Buffer.from(bytes);corrupt[0]^=1;await check({...fixture,sha256:sha(corrupt)},corrupt,mime,'signature');
}
// Falha do provedor criptográfico é observável; não vira resultado de validação bem-sucedida.
const descriptor=Object.getOwnPropertyDescriptor(globalThis,'crypto');assert.ok(descriptor?.configurable);
try{
 Object.defineProperty(globalThis,'crypto',{configurable:true,value:{subtle:{digest:async()=>{throw Error('fixture-digest-failure');}}}});
 await assert.rejects(()=>verify(png,{status:200,contentType:'image/png',body},body.length),/fixture-digest-failure/);cases++;
}finally{Object.defineProperty(globalThis,'crypto',descriptor);}
assert.equal(JSON.stringify(data),originalData,'canonical data mutated');
console.log('DONATION_ASSET_RESPONSE_CANONICAL_ASSETS_NEGATIVES_AND_IMMUTABILITY_OK cases='+cases+' canonical='+data.assets.length);
