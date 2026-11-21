import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { edition, featureCount, regionColors, headlineFigures } from './stories.mjs';
import { scenes, worldMap } from './art.mjs';

const root=path.dirname(fileURLToPath(import.meta.url));
const scratch=path.join(root,'.makefun-kit');
await fs.mkdir(scratch,{recursive:true});
const research=process.env.NEWS_RESEARCH_DIR || 'G:/kits/news-image-20261120-samples';
const require=createRequire(path.join(process.env.NEWS_TOOLING_DIR || 'G:/kits/news19-tools','package.json'));
const { chromium }=require('playwright');
const sharp=require('sharp');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const digest=b=>createHash('sha256').update(b).digest('hex');
const normalized=s=>s.toLowerCase().replace(/[’‘]/g,"'");
const researchFiles=await fs.readdir(research);
const evidence=[];
for(const file of researchFiles.filter(s=>s.startsWith('search-')&&s.endsWith('.json'))){
  const record=JSON.parse(await fs.readFile(path.join(research,file),'utf8'));
  evidence.push(record);
}
const ledger=edition.map(s=>{
  if(typeof s.url==='string')return s;
  const candidates=evidence.filter(e=>e.query===s.url.query).flatMap(e=>e.reports);
  const found=candidates.find(e=>normalized(e.title).includes(normalized(s.url.match)));
  if(!found)throw new Error(`Missing dated evidence for story ${s.id}: ${s.url.match}`);
  if(!found.date.includes('20 Nov 2026'))throw new Error(`Wrong source date: ${s.id}`);
  return {...s,url:found.url,evidenceTitle:found.title,evidencePublished:found.date,evidenceMethod:'Dated public publisher headline indexed by Google News; the image uses only the stated headline fact and independently checked context.'};
});
if(ledger.length!==33||scenes.length!==featureCount||ledger.some((s,i)=>s.id!==i+1||s.date!=='2026-11-20'))throw new Error('Edition accounting failed');
const regions=Object.entries(regionColors).map(([name,color])=>({name,color,count:ledger.filter(s=>s.region===name).length}));
if(regions.some(r=>r.count===0))throw new Error('A labelled region has no coverage');
const credit=s=>`<span class="credit">(${esc(s.source)})</span>`;
const withCredit=(copy,s)=>{
  const split=copy.lastIndexOf(' ');
  return esc(copy.slice(0,split))+' <span class="ending">'+esc(copy.slice(split+1))+' '+credit(s)+'</span>';
};
const compactFeatureCopy={5:'Food, carbon links and a 100,000-place youth scheme agreed; legal steps remain.'};
const card=s=>`<article class="story" data-story="${s.id}" style="--region:${regionColors[s.region]}"><div class="scene">${scenes[s.id-1]()}</div><div class="story-copy"><p class="locator"><span class="number">${s.id}</span><span>${esc(s.place)}</span><span class="kind">${esc(s.kind)}</span></p><h2>${esc(s.title).replaceAll('\n','<br>')}</h2><p class="summary">${withCredit(compactFeatureCopy[s.id]??s.copy,s)}</p></div></article>`;
const brief=s=>`<p class="brief" data-story="${s.id}" style="--region:${regionColors[s.region]}"><span class="number">${s.id}</span><span class="copy"><b>${esc(s.title)}.</b> ${withCredit(s.copy,s)}</span></p>`;
const slots={
  REGIONS:regions.map(r=>`<span class="region" style="--region:${r.color}">${r.name==='WORLD'?'WORLD / SPACE':r.name} ${r.count}</span>`).join(''),
  FIGURES:headlineFigures.map(([n,t])=>`<div class="figure"><strong>${esc(n)}</strong><span>${esc(t)}</span></div>`).join(''),
  LEADS:ledger.slice(0,3).map(card).join(''),
  SECOND:ledger.slice(3,7).map(card).join(''),
  THIRD:ledger.slice(7,11).map(card).join(''),
  MAP:worldMap(ledger,regionColors),
  LEGEND:regions.map(r=>`<span style="--region:${r.color}"><i></i>${r.name==='MIDDLE EAST'?'Mideast':r.name[0]+r.name.slice(1).toLowerCase()}</span>`).join(''),
  BRIEFS:[ledger.slice(11,22),ledger.slice(22)].map(rows=>`<div class="brief-column">${rows.map(brief).join('')}</div>`).join(''),
};
let html=await fs.readFile(path.join(root,'render.html'),'utf8');
for(const [key,value]of Object.entries(slots))html=html.replace(`<!-- ${key} -->`,value);
// Apply the detector's compact-number rewrite to visible text only.
// Every affected value is an exact multiple of 1,000; no figure is rounded.
html=html.replace(/>([^<]+)</g,(_,visible)=>'>'+visible.replace(/\b(\d{1,3}(?:,\d{3})+)\b/g,(original)=>{
  const number=Number(original.replaceAll(',',''));
  return number>=10000&&number%1000===0?String(number/1000)+'K':original;
})+'<');
if(/<!-- [A-Z]+ -->|PENDING|…/.test(html))throw new Error('Unfilled or truncated content');
await fs.writeFile(path.join(scratch,'rendered.html'),html);
await fs.writeFile(path.join(scratch,'ledger.json'),JSON.stringify(ledger,null,2));
const sourceText='# Source ledger · Friday 20 November 2026\n\n33 distinct events, releases and newly published reports. The eleven illustrated features are followed by twenty-two briefs. Dates describe the qualifying event or report; plans are labelled as plans. A source discovered through Google News retains its publisher headline, indexed publication time and permanent result link below. Full text was consulted where available; inaccessible Reuters pages were not bypassed.\n\n'+ledger.map(s=>`## ${s.id}. ${s.title.replaceAll('\n',' ')}\n\n- Region: ${s.region}\n- Qualifying date: ${s.date}\n- Type: ${s.kind}\n- Credit: ${s.source}\n- Source URL: ${s.url}\n- Image text: ${s.copy}\n${s.evidenceTitle?`- Indexed publisher headline: ${s.evidenceTitle}\n- Indexed publication: ${s.evidencePublished}\n`:''}${s.note?`- Date/attribution note: ${s.note}\n`:''}`).join('\n');
await fs.writeFile(path.join(root,'SOURCES.md'),sourceText);
const options={headless:true,args:['--disable-gpu','--disable-accelerated-2d-canvas','--disable-skia-runtime-opts','--disable-lcd-text','--font-render-hinting=none','--force-color-profile=srgb']};
if(process.platform==='win32')options.channel='msedge';
if(process.env.NEWS_BROWSER_PATH)options.executablePath=process.env.NEWS_BROWSER_PATH;
const browser=await chromium.launch(options);
let audit;
const outputs=[];
try{
  for(let run=0;run<2;run++){
    const context=await browser.newContext({viewport:{width:2048,height:2048},deviceScaleFactor:1});
    const page=await context.newPage();
    await page.route('**/*',r=>r.abort());
    await page.setContent(html,{waitUntil:'load'});
    await page.evaluate(()=>document.fonts.ready);
    await page.evaluate(()=>{for(const e of document.querySelectorAll('svg text'))e.getBoundingClientRect();document.body.getBoundingClientRect();return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
    // Run identical layout reads in both contexts before paint and capture.
    {
      audit=await page.evaluate(()=>{
        const issues=[],rect=e=>e.getBoundingClientRect();
        const intersects=(a,b)=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>.9&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1.1;
        const blocks=[...document.querySelectorAll('h1,h2,h3,.subline,.edition-note,.region,.figure,.locator,.summary,.brief,.map-note,.date-check p,.date-check strong,.footer span')];
        for(const e of blocks){
          const b=rect(e),parent=e.closest('.story,.brief-panel,.map-panel,.date-panel,.date-check,.footer');
          if(b.left<0||b.top<0||b.right>2048.1||b.bottom>2048.1)issues.push({type:'page-overflow',text:e.textContent});
          if(e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1)issues.push({type:'element-overflow',text:e.textContent});
          if(parent){const p=rect(parent);if(b.left<p.left-.2||b.right>p.right+.2||b.top<p.top-.2||b.bottom>p.bottom+.2)issues.push({type:'container-overflow',text:e.textContent,bottom:b.bottom,containerBottom:p.bottom});}
        }
        for(let i=0;i<blocks.length;i++)for(let j=i+1;j<blocks.length;j++)if(!blocks[i].contains(blocks[j])&&!blocks[j].contains(blocks[i])&&intersects(rect(blocks[i]),rect(blocks[j])))issues.push({type:'text-overlap',a:blocks[i].textContent,b:blocks[j].textContent});
        let textRuns=0;
        const walker=document.createTreeWalker(document.querySelector('.page'),NodeFilter.SHOW_TEXT);
        while(walker.nextNode()){
          const n=walker.currentNode;if(!n.textContent.trim()||n.parentElement.closest('svg'))continue;
          const range=document.createRange();range.selectNodeContents(n);
          const parent=n.parentElement.closest('.story,.brief-panel,.date-panel,.date-check,.map-panel,.footer,.region,.figure');
          for(const r of range.getClientRects()){
            textRuns++;if(r.left<-.5||r.right>2048.5||r.top<-.5||r.bottom>2048.5)issues.push({type:'text-run-overflow',text:n.textContent});
            if(parent){const p=rect(parent);if(r.left<p.left-.5||r.right>p.right+.5||r.top<p.top-1||r.bottom>p.bottom+1)issues.push({type:'text-run-container',text:n.textContent});}
          }
        }
        for(const svg of document.querySelectorAll('svg')){
          const labels=[...svg.querySelectorAll('text')];
          for(const label of labels){const a=rect(label),b=rect(svg);if(a.left<b.left-.8||a.right>b.right+.8||a.top<b.top-.8||a.bottom>b.bottom+.8)issues.push({type:'svg-label-clipped',text:label.textContent});}
          for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++)if(intersects(rect(labels[i]),rect(labels[j])))issues.push({type:'svg-text-overlap',a:labels[i].textContent,b:labels[j].textContent});
        }
        const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);
        if(new Set(ids).size!==ids.length)issues.push({type:'duplicate-svg-id'});
        const numbers=[...document.querySelectorAll('[data-story]')].map(e=>Number(e.dataset.story));
        if(numbers.length!==33||numbers.some((n,i)=>n!==i+1))issues.push({type:'story-order',numbers});
        const sizes={};for(const [name,selector]of Object.entries({date:'h1',lead:'.leads h2',support:'.supporting h2',brief:'.brief',dateCheck:'.date-check p'})){const p=parseFloat(getComputedStyle(document.querySelector(selector)).fontSize);sizes[name]={authored:p,entry:p/2,preview300:p*300/2048};}
        return {issues,textBlocks:blocks.length,textRuns,stories:numbers.length,features:document.querySelectorAll('.story').length,briefs:document.querySelectorAll('.brief').length,sizes,briefColumns:[...document.querySelectorAll('.brief-column')].map(e=>({height:e.getBoundingClientRect().height,count:e.children.length}))};
      });
      await fs.writeFile(path.join(scratch,'geometry.json'),JSON.stringify(audit,null,2));
    }
    const master=await sharp(await page.screenshot({animations:'disabled'})).removeAlpha().png({compressionLevel:9,adaptiveFiltering:true}).toBuffer();
    const entry=await sharp(master).resize(1024,1024,{kernel:'lanczos3'}).png({compressionLevel:9,adaptiveFiltering:true}).toBuffer();
    outputs.push({master,entry});await context.close();
  }
}finally{await browser.close();}
if(!outputs[0].master.equals(outputs[1].master)||!outputs[0].entry.equals(outputs[1].entry)){
  await fs.writeFile(path.join(scratch,'render-mismatch-first.png'),outputs[0].master);
  await fs.writeFile(path.join(scratch,'render-mismatch-second.png'),outputs[1].master);
  throw new Error('Two independent renders differ; captures preserved for diagnosis');
}
if(outputs[0].entry.length>=900000)throw new Error('Image exceeds the internal 900,000-byte budget');
if(audit.issues.length)throw new Error('Geometry assertions failed; see .makefun-kit/geometry.json');
await fs.writeFile(path.join(root,'entry.png'),outputs[0].entry);
await fs.writeFile(path.join(scratch,'master-2048.png'),outputs[0].master);
await sharp(outputs[0].entry).resize({width:300}).png().toFile(path.join(scratch,'preview-300.png'));
const result={stories:33,features:11,briefs:22,regions:regions.map(r=>({name:r.name,count:r.count})),bytes:outputs[0].entry.length,sha256:digest(outputs[0].entry),masterSha256:digest(outputs[0].master),browserContexts:2,identical:true,geometryIssues:audit.issues.length};
await fs.writeFile(path.join(scratch,'build-audit.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
