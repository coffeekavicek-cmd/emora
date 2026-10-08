import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[],dir=path.resolve('v5-live/qa-v10-results');await fs.mkdir(dir,{recursive:true});
for(const cfg of [{w:360,h:740,lang:'uz'},{w:390,h:844,lang:'ru'},{w:430,h:932,lang:'en'}]){
 const failures=[],errors=[];const page=await browser.newPage({viewport:{width:cfg.w,height:cfg.h},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push(e.message));
 try{
  const resp=await page.goto(base+'/templates/v19-birthday-cake.html?lang='+cfg.lang,{waitUntil:'domcontentloaded'});
  if(resp.status()!==200)failures.push('Experience status '+resp.status());
  await page.waitForFunction(()=>window.__EMORA_HEART_V23__?.ready===true,null,{timeout:10000});
  const box=await page.locator('#heartSlider').count();
  if(box!==1)failures.push('Heart slider missing');
  await page.evaluate(()=>window.postMessage({type:'emora:moment-preview',config:{recipient:'Jasmina',birthday:'2005-08-15',photos:[location.origin+'/assets/birthday-aurora.png','',''],letter:'Just for you ♡'}},location.origin));
  await page.waitForFunction(()=>window.__EMORA_HEART_V23__?.recipient==='Jasmina');
  await page.locator('#dateForm button').click();
  for(let i=0;i<5;i++)await page.locator('#candles .candle').nth(i).click();
  await page.locator('#cakeNext').click();
  await page.locator('[data-next=film]').click();
  await page.locator('[data-next=letter]').click();
  await page.locator('#openLetter').click();
  await page.locator('#letterNext').click();
  await page.waitForFunction(()=>window.__EMORA_BIRTHDAY_V19__?.active==='finale');
  const details=await page.evaluate(()=>({painted:window.__EMORA_HEART_V23__.namesPainted,ready:window.__EMORA_HEART_V23__.ready,width:document.documentElement.scrollWidth,viewport:innerWidth,label:document.querySelector('#namesHeartNote')?.textContent||'',photo:document.querySelector('#heartRecipientPhoto')?.getAttribute('href')}));
  if(details.painted<900)failures.push('Not enough actual name text strokes: '+details.painted);
  if(details.width>cfg.w+4||details.viewport>cfg.w+4)failures.push('Overflow in heart finale '+JSON.stringify(details));
  if(!details.label.includes('Jasmina')||!details.label.includes('133'))failures.push('Localized personal heart message missing');
  if(!details.photo?.includes('birthday-aurora'))failures.push('Personal recipient photo absent');
  await page.locator('#heartSlider').fill('100');
  await page.waitForFunction(()=>Number(document.querySelector('#heartRevealRect')?.getAttribute('width'))===400);
  if(await page.evaluate(()=>window.__EMORA_HEART_V23__.percent)!==100)failures.push('Slide did not reveal photo');
  await page.screenshot({path:path.join(dir,'v23-heart-'+cfg.lang+'-'+cfg.w+'.png'),fullPage:false});
  await page.locator('#replay').click();
  if(await page.evaluate(()=>window.__EMORA_HEART_V23__.percent)!==0)failures.push('Replay did not reset heart reveal');
 }catch(e){failures.push(e.message)}
 if(errors.length)failures.push('JS exceptions: '+errors.join(' | '));
 results.push({language:cfg.lang,viewport:cfg.w+'x'+cfg.h,passed:!failures.length,failures});
 await page.close();
}
await browser.close();const passed=results.every(r=>r.passed);const summary={passed,results};
console.log(JSON.stringify(summary,null,2));await fs.writeFile(path.join(dir,'v23-heart-qa.json'),JSON.stringify(summary,null,2));if(!passed)process.exitCode=1;
