import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const directory=path.resolve('v5-live/qa-v10-results');await fs.mkdir(directory,{recursive:true});
const scenarios=[{key:'love',path:'/templates/v26-love-confession.html',lang:'uz',width:390,height:844},{key:'birthday',path:'/templates/v19-birthday-cake.html',lang:'ru',width:360,height:740}];
const results=[];
for(const a of scenarios){
 const page=await browser.newPage({viewport:{width:a.width,height:a.height},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 const failures=[],jsErrors=[];page.on('pageerror',e=>jsErrors.push(e.message));
 try{
  const res=await page.goto(base+a.path+'?lang='+a.lang,{waitUntil:'domcontentloaded',timeout:35000});
  if(res.status()!==200)failures.push('Route status '+res.status());
  await page.waitForFunction(()=>window.__EMORA_MOSAIC_V27__?.ready===true,null,{timeout:15000});
  const first=await page.evaluate(()=>({algorithm:window.__EMORA_MOSAIC_V27__.algorithm,source:window.__EMORA_MOSAIC_V27__.portraitSource,names:window.__EMORA_MOSAIC_V27__.namesPainted,href:document.querySelector('#heartRecipientPhoto')?.getAttribute('href'),helper:document.querySelector('#portraitSourceNote')?.textContent}));
  if(first.algorithm!=='sampled-typographic-portrait-v27'||first.names<1000||first.source!=='demo')failures.push('Unexpected demo mosaic: '+JSON.stringify(first));
  if(first.href?.includes('rose.png')||first.href?.includes('birthday-aurora.png'))failures.push('Still overlaying floral photo over names');
  if(!first.helper?.trim())failures.push('Illustrated demo portrait not labeled');
  if(a.key==='love'){
   await page.locator('[data-answer=nobody]').click();
   await page.locator('#galleryNext').click();await page.locator('#filmNext').click();await page.locator('#envelopeBtn').click();await page.locator('#letterNext').click()
  }else{
   await page.locator('#dateForm button').click();
   for(let i=0;i<5;i++)await page.locator('#candles .candle').nth(i).click();
   await page.locator('#cakeNext').click();
   await page.locator('[data-next=film]').click();
   await page.locator('[data-next=letter]').click();
   await page.locator('#openLetter').click();
   await page.locator('#letterNext').click()
  }
  await page.locator('#heartSlider').waitFor();
  const pixels0=await page.locator('#namesHeartCanvas').evaluate(canvas=>[...canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data]);
  await page.screenshot({path:path.join(directory,'v27-'+a.key+'-before.png')});
  await page.locator('#heartSlider').fill('100');
  await page.waitForFunction(()=>Number(document.querySelector('#heartRevealRect')?.getAttribute('width'))===400);
  const pixels1=await page.locator('#namesHeartCanvas').evaluate(canvas=>[...canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data]);
  let changed=0,nonzero=0;const tones=new Set();
  for(let j=0;j<pixels0.length;j+=16){
   if(Math.abs(pixels0[j]-pixels1[j])+Math.abs(pixels0[j+1]-pixels1[j+1])+Math.abs(pixels0[j+2]-pixels1[j+2])>45)changed++;
   if(pixels1[j+3]>200){nonzero++;tones.add((pixels1[j]>>4)+'-'+(pixels1[j+1]>>4)+'-'+(pixels1[j+2]>>4))}
  }
  if(changed<1700||tones.size<30||nonzero<3000)failures.push('Slider reveals flat/no portrait: '+JSON.stringify({changed,tones:tones.size,nonzero}));
  if(await page.locator('#namesHeartPhoto').evaluate(svg=>getComputedStyle(svg).display)!=='none')failures.push('Old SVG photo overlay visible');
  const overflow=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
  if(overflow.scroll>overflow.width+4)failures.push('Horizontal overflow '+JSON.stringify(overflow));
  await page.screenshot({path:path.join(directory,'v27-'+a.key+'-typographic-portrait.png')});
  // Same renderer must use an explicitly supplied image instead of the sample portrait.
  await page.evaluate((key)=>window.postMessage({type:key==='love'?'emora:preview':'emora:moment-preview',config:{recipient:'Jasmina',photos:[location.origin+'/assets/love-rose.png','','']}},location.origin),a.key);
  await page.waitForFunction(()=>window.__EMORA_MOSAIC_V27__?.portraitSource==='personal',null,{timeout:15000});
 }catch(e){failures.push('Browser: '+e.message)}
 if(jsErrors.length)failures.push('JS errors: '+jsErrors.join(' | '));
 results.push({scenario:a.key,width:a.width,passed:failures.length===0,failures});
 await page.close()
}
await browser.close();
const all={passed:results.every(a=>a.passed),results};console.log(JSON.stringify(all,null,2));
await fs.writeFile(path.join(directory,'v27-portrait-qa.json'),JSON.stringify(all,null,2));if(!all.passed)process.exitCode=1;
