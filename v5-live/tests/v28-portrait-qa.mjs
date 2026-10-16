import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const out=path.resolve('v5-live/qa-v10-results');await fs.mkdir(out,{recursive:true});
const chromiumArgs=['--no-sandbox','--disable-dev-shm-usage'];
const browser=await chromium.launch({headless:true,args:chromiumArgs});
const targets=[{key:'love',page:'/templates/v26-love-confession.html',size:[390,844],lang:'uz'},
{key:'birthday',page:'/templates/v19-birthday-cake.html',size:[360,740],lang:'ru'}];
const results=[];
for(const t of targets){
 const pg=await browser.newPage({viewport:{width:t.size[0],height:t.size[1]},isMobile:true,hasTouch:true});
 const fails=[],errors=[];pg.on('pageerror',e=>errors.push(e.message));
 try{
  let response=await pg.goto(base+t.page+'?lang='+t.lang,{waitUntil:'domcontentloaded',timeout:35000});
  if(response.status()!==200)fails.push('HTTP '+response.status());
  await pg.waitForFunction(()=>window.__EMORA_MOSAIC_V28__?.ready===true,null,{timeout:18000});
  if(t.key==='love'){
   await pg.locator('[data-answer=friend]').click();
   await pg.locator('#galleryNext').click();
   await pg.locator('#filmNext').click();
   await pg.locator('#envelopeBtn').click();
   await pg.locator('#letterNext').click();
  }else{
   await pg.locator('#birthday').fill('2005-08-15');
   await pg.locator('#dateForm button').click();
   for(let i=0;i<5;i++)await pg.locator('#candles .candle').nth(i).click();
   await pg.locator('#cakeNext').click();
   await pg.locator('[data-next=film]').click();
   await pg.locator('[data-next=letter]').click();
   await pg.locator('#openLetter').click();
   await pg.locator('#letterNext').click();
  }
  await pg.locator('#heartSlider').waitFor();
  const first=await pg.evaluate(()=>({ready:window.__EMORA_MOSAIC_V28__.ready,algorithm:window.__EMORA_MOSAIC_V28__.algorithm,source:window.__EMORA_MOSAIC_V28__.portraitSource,photoKind:window.__EMORA_MOSAIC_V28__.sampleKind,letters:window.__EMORA_MOSAIC_V28__.namesPainted}));
  if(!first.ready||first.algorithm!=='smooth-photo-typography-v28'||first.letters<1000)fails.push('Portrait renderer not initialized '+JSON.stringify(first));
  // Headless browser must load an actual photographic source, not hide behind vector fallback.
  if(first.photoKind!=='remote-photo')fails.push('Portrait sample is not a real photograph: '+JSON.stringify(first));
  const frames={};
  for(const p of [0,33,50,70,100]){
   await pg.locator('#heartSlider').fill(String(p));
   await pg.waitForFunction(expected=>window.__EMORA_MOSAIC_V28__?.percent===expected,p);
   await pg.screenshot({path:path.join(out,'v28-'+t.key+'-'+p+'pct.png'),fullPage:false});
   frames[p]=await pg.locator('#namesHeartCanvas').evaluate(c=>({width:c.width,height:c.height,pixels:Array.from(c.getContext('2d').getImageData(0,0,c.width,c.height).data)}));
  }
  // Under the existing hard-wipe bug the right half was exactly unchanged at 50%.
  const c0=frames[0].pixels,c50=frames[50].pixels,c100=frames[100].pixels,ww=frames[0].width,hh=frames[0].height;
  let rightChanged=0,finalChanged=0,detail=new Set();
  for(let y=Math.round(hh*.21);y<hh*.72;y+=4){
   for(let x=Math.round(ww*.55);x<Math.round(ww*.76);x+=4){
    let i=(y*ww+x)*4;
    if(Math.abs(c0[i]-c50[i])+Math.abs(c0[i+1]-c50[i+1])+Math.abs(c0[i+2]-c50[i+2])>15)rightChanged++;
   }
  }
  for(let i=0;i<c0.length;i+=12){
   if(Math.abs(c0[i]-c100[i])+Math.abs(c0[i+1]-c100[i+1])+Math.abs(c0[i+2]-c100[i+2])>45)finalChanged++;
   if(c100[i+3]>230)detail.add((c100[i]>>4)+'-'+(c100[i+1]>>4)+'-'+(c100[i+2]>>4));
  }
  if(rightChanged<100)fails.push('Old hard wipe is still present; right half stayed unchanged at 50%: '+rightChanged);
  if(finalChanged<1900||detail.size<40)fails.push('Portrait lacks recognizable light and shadow detail: '+JSON.stringify({finalChanged,tones:detail.size}));
  const mobile=await pg.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth,footer:document.querySelector('.foot')?.getBoundingClientRect().top,button:document.querySelector('#finale #replay')?.getBoundingClientRect().bottom}));
  if(mobile.scroll>mobile.w+4)fails.push('Horizontal screen overflow: '+JSON.stringify(mobile));
  if(t.key==='love'&&mobile.button>mobile.footer-3)fails.push('Replay button overlaps footer: '+JSON.stringify(mobile));
  const oldOverlay=await pg.locator('#namesHeartPhoto').evaluate(s=>getComputedStyle(s).display);
  if(oldOverlay!=='none')fails.push('Legacy photo overlay still visible');
  // Replacing a recipient photo must use the chosen photo rather than the sample.
  await pg.evaluate(key=>window.postMessage({type:key==='love'?'emora:preview':'emora:moment-preview',config:{recipient:'Jasmina',photos:[location.origin+'/assets/love-rose.png']}},location.origin),t.key);
  await pg.waitForFunction(()=>window.__EMORA_MOSAIC_V28__?.portraitSource==='personal',null,{timeout:12000});
 }catch(e){fails.push('Browser: '+e.message)}
 if(errors.length)fails.push('JS exceptions: '+errors.join(' | '));
 results.push({scenario:t.key,viewport:t.size,passed:!fails.length,failures:fails});
 await pg.close();
}
await browser.close();
const result={passed:results.every(x=>x.passed),results};
console.log(JSON.stringify(result,null,2));
await fs.writeFile(path.join(out,'v28-portrait-summary.json'),JSON.stringify(result,null,2));
if(!result.passed)process.exitCode=1;
