import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root=path.dirname(fileURLToPath(import.meta.url));
const output=path.join(root,'.makefun-kit');
const bytes=await fs.readFile(path.join(root,'entry.png'));
if(bytes.length>=900000||!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw new Error('Invalid PNG signature or internal size budget');
const crc=buffer=>{let value=0xffffffff;for(const b of buffer){value^=b;for(let bit=0;bit<8;bit++)value=(value>>>1)^((value&1)?0xedb88320:0);}return(value^0xffffffff)>>>0;};
let position=8,ihdr,ended=false;
const idat=[];
while(position<bytes.length){
  if(position+12>bytes.length)throw new Error('Truncated chunk header');
  const size=bytes.readUInt32BE(position),end=position+size+12,type=bytes.toString('ascii',position+4,position+8);
  if(end>bytes.length)throw new Error('Truncated chunk');
  if(crc(bytes.subarray(position+4,end-4))!==bytes.readUInt32BE(end-4))throw new Error(`Incorrect ${type} checksum`);
  if(type==='IHDR')ihdr=bytes.subarray(position+8,end-4);
  if(type==='IDAT')idat.push(bytes.subarray(position+8,end-4));
  position=end;
  if(type==='IEND'){ended=true;break;}
}
if(!ended||position!==bytes.length||!ihdr||ihdr.length!==13)throw new Error('Incomplete PNG');
const width=ihdr.readUInt32BE(0),height=ihdr.readUInt32BE(4),channels={0:1,2:3,4:2,6:4}[ihdr[9]];
if(width!==1024||height!==1024||ihdr[8]!==8||!channels||ihdr[12]!==0)throw new Error('Unexpected PNG dimensions or format');
const pixels=inflateSync(Buffer.concat(idat));
if(pixels.length!==(width*channels+1)*height)throw new Error('Incomplete decoded scanlines');
for(let row=0;row<height;row++)if(pixels[row*(width*channels+1)]>4)throw new Error('Invalid PNG scanline filter');
const hash=b=>createHash('sha256').update(b).digest('hex');
const executions=[];
for(let run=1;run<=2;run++){
  const folder=path.join(output,`native-${run}`);await fs.mkdir(folder,{recursive:true});
  const result=spawnSync(process.execPath,[path.join(root,'main.ts')],{cwd:root,env:{...process.env,MAKEFUN_OUTPUT_DIR:folder},encoding:'utf8',timeout:10000});
  if(result.status!==0)throw new Error(`Native execution failed: ${result.stderr}`);
  const artifact=await fs.readFile(path.join(folder,'entry.png'));
  if(!artifact.equals(bytes))throw new Error('Native runtime bytes differ');
  executions.push({run,sha256:hash(artifact),bytes:artifact.length});
}
const verdict={valid:true,width,height,bytes:bytes.length,sha256:hash(bytes),chunkCRCs:true,decodedScanlines:height,completeTerminalChunk:true,nativeExecutions:executions};
await fs.writeFile(path.join(output,'runtime-audit.json'),JSON.stringify(verdict,null,2));
console.log(JSON.stringify(verdict));
