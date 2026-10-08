import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const output=path.resolve('v5-live/qa-v10-results');
await fs.mkdir(output,{recursive:true});
const configs=[{name:'mobile-uz',lang:'uz',width:390,height:844},{name:'small-ru',lang:'ru',width:360,height:740},{name:'desktop-en',lang:'en',width:1440,height:900}];
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[];
try{
 for(const cfg of configs){
  const page=await browser.newPage({viewport:{width:cfg.width,height:cfg.height},isMobile:cfg.width<700,hasTouch:cfg.width<700});
  const failures=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   const response=await page.goto(base+'/templates/v19-birthday-cake.html?lang='+cfg.lang,{waitUntil:'domcontentloaded',timeout:45000});
   if(response.status()!==200)failures.push('HTTP '+response.status());
   await page.waitForFunction(()=>window.__EMORA_BIRTHDAY_V19__?.version===19);
   const local=await page.evaluate(()=>({lang:document.documentElement.lang,stages:window.__EMORA_BIRTHDAY_V19__.stages}));
   if(local.lang!==cfg.lang||local.stages.join('|')!=='date|cake|photos|film|letter|finale')failures.push('Localization or stage map invalid');
   await page.evaluate(()=>window.postMessage({type:'emora:moment-preview',config:{recipient:'DILNOZA QA',sender:'AZIZ QA',birthday:'2005-08-15',photos:['/assets/birthday-aurora.png','/assets/birthday-aurora.png','/assets/birthday-aurora.png'],captions:['CAP 1','CAP 2','CAP 3'],letter:'PRIVATE QA LETTER',finalQuestion:'QA FINALE'}},location.origin));
   await page.waitForFunction(()=>document.querySelector('#letterText')?.textContent==='PRIVATE QA LETTER');
   if(await page.locator('#birthday').inputValue()!=='2005-08-15')failures.push('Birthday date did not hydrate');
   await page.locator('#dateForm button[type=submit]').click();
   await page.waitForFunction(()=>window.__EMORA_BIRTHDAY_V19__?.active==='cake');
   const candles=page.locator('#candles .candle');
   if(await candles.count()!==5)failures.push('Expected five independently operable candles');
   for(let i=0;i<5;i++){
    await candles.nth(i).click();
    const out=await page.evaluate(()=>window.__EMORA_BIRTHDAY_V19__.candlesOut);
    if(out!==i+1)failures.push('Candle progression failed on '+i);
   }
   if(await page.locator('#cakeNext').isHidden())failures.push('Next remains hidden after all five candles');
   await page.locator('#cakeNext').click();
   await page.waitForFunction(()=>window.__EMORA_BIRTHDAY_V19__.active==='photos');
   const photos=page.locator('#gallery .photo-card');
   if(await photos.count()!==3)failures.push('Expected three recipient portraits');
   const captions=await page.locator('#gallery .photo-card p').allTextContents();
   if(captions.join('|')!=='CAP 1|CAP 2|CAP 3')failures.push('Personal captions not hydrated: '+captions.join('|'));
   await page.locator('[data-next=film]').click();
   await page.waitForFunction(()=>window.__EMORA_BIRTHDAY_V19__.active==='film');
   if(await page.locator('#filmVideo').isVisible())failures.push('Missing video should not expose empty media controls');
   await page.locator('[data-next=letter]').click();
   await page.waitForFunction(()=>window.__EMORA_BIRTHDAY_V19__.active==='letter');
   if(await page.locator('#letterNext').isVisible())failures.push('Letter skip button exposed before open');
   await page.locator('#openLetter').click();
   await page.waitForSelector('#letterWorld.opened');
   await page.waitForSelector('#letterNext:visible',{timeout:3000});
   await page.locator('#letterNext').click();
   await page.waitForFunction(()=>window.__EMORA_BIRTHDAY_V19__.active==='finale');
   if(await page.locator('#mosaic img').count()!==6)failures.push('Mosaic missing tiles');
   if(await page.locator('#finalTitle').textContent()!=='QA FINALE')failures.push('Final personalized text not rendered');
   const dim=await page.evaluate(()=>({width:document.documentElement.scrollWidth,window:innerWidth,height:document.documentElement.scrollHeight,screen:innerHeight}));
   if(dim.width>dim.window+3)failures.push('Horizontal overflow '+JSON.stringify(dim));
   await page.screenshot({path:path.join(output,'v19-birthday-'+cfg.name+'.png'),fullPage:false});
   await page.locator('#replay').click();
   if(await page.evaluate(()=>window.__EMORA_BIRTHDAY_V19__.active)!=='date')failures.push('Replay did not restart');
   if(await page.evaluate(()=>window.__EMORA_BIRTHDAY_V19__.candlesOut)!==0)failures.push('Replay did not reset candle state');
  }catch(e){failures.push('Browser test exception: '+e.message)}
  if(errors.length)failures.push('Browser JS errors: '+errors.join(' | '));
  results.push({viewport:cfg.width+'x'+cfg.height,language:cfg.lang,passed:failures.length===0,failures});
  await page.close();
 }
}finally{await browser.close()}
const status={passed:results.every(x=>x.passed),results};
await fs.writeFile(path.join(output,'v19-birthday-ritual-summary.json'),JSON.stringify(status,null,2));
console.log(JSON.stringify(status,null,2));
if(!status.passed)process.exitCode=1;
