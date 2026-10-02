import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const folder=path.resolve('v5-live/qa-v10-results');await fs.mkdir(folder,{recursive:true});
const devices=[{name:'mobile',width:390,height:844},{name:'small',width:360,height:740},{name:'desktop',width:1440,height:900}];
const results=[];const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{for(const d of devices){
 const page=await browser.newPage({viewport:{width:d.width,height:d.height},deviceScaleFactor:1,hasTouch:d.name!=='desktop',isMobile:d.name!=='desktop'});const failures=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  const r=await page.goto(base+'/templates/v10-birthday-aurora.html?qa=1',{waitUntil:'domcontentloaded',timeout:45000});if(r.status()!==200)failures.push('HTTP '+r.status());
  await page.waitForFunction(()=>window.__EMORA_AURORA_PAPER__?.flagship===true,null,{timeout:15000});
  const marker=await page.evaluate(()=>window.__EMORA_AURORA_PAPER__);if(JSON.stringify(marker.sequence)!==JSON.stringify(['gift','wishes','memories','film-letter','mosaic-wish']))failures.push('Wrong flagship sequence');
  await page.evaluate(()=>window.postMessage({type:'emora:moment-preview',config:{recipient:'QA DILNOZA',sender:'QA AZIZ',memoryTitle:'QA ENG CHIROYLI KADRLAR',captions:['QA BIRINCHI TILAK','QA IKKINCHI TILAK','QA UCHINCHI TILAK'],letter:'QA tugilgan kun maktubi',finalQuestion:'QA BUGUN HAMMA NUR SENIKI',photos:['/assets/birthday-aurora.png','/assets/birthday-aurora.png','/assets/birthday-aurora.png'],video:'https://example.invalid/aurora.mp4'}},location.origin));
  await page.waitForTimeout(450);
  const start=await page.evaluate(()=>({w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight,name:document.querySelector('.ap-name')?.textContent}));if(start.w>d.width+4)failures.push('Intro horizontal overflow '+start.w);if(start.h>d.height+4)failures.push('Intro vertical overflow '+start.h);if(start.name!=='QA DILNOZA')failures.push('Recipient roundtrip failed');
  await page.locator('#openIntro').click();await page.waitForTimeout(850);await page.locator('#chapter-1 .ap-untie').click();await page.waitForFunction(()=>document.querySelector('#main>.v11-stage-active')?.id==='chapter-2',null,{timeout:4500});
  const wishCards=page.locator('#chapter-2 .ap-wish-card');if(await wishCards.count()!==3)failures.push('Expected 3 wish cards');for(let i=0;i<3;i++)await wishCards.nth(i).click();const wishCopy=await page.locator('#chapter-2 .ap-wish-copy').allTextContents();if(wishCopy.join('|')!=='QA BIRINCHI TILAK|QA IKKINCHI TILAK|QA UCHINCHI TILAK')failures.push('Wish captions roundtrip failed: '+wishCopy.join('|'));await page.locator('#chapter-2 .ap-wishes-next').click();
  await page.waitForFunction(()=>document.querySelector('#main>.v11-stage-active')?.id==='chapter-3',null,{timeout:4500});const memories=page.locator('#chapter-3 .ap-memory');if(await memories.count()!==3)failures.push('Expected 3 memories');const memoryTitle=await page.locator('.ap-memory-title').textContent();if(memoryTitle!=='QA ENG CHIROYLI KADRLAR')failures.push('Memory title roundtrip failed: '+memoryTitle);await memories.nth(1).click();await page.locator('#chapter-3 .ap-memory-next').click();
  await page.waitForFunction(()=>document.querySelector('#main>.v11-stage-active')?.id==='chapter-4',null,{timeout:4500});const letter=await page.locator('.ap-letter-copy').textContent();if(letter!=='QA tugilgan kun maktubi')failures.push('Letter roundtrip failed: '+letter);const videos=await page.locator('.ap-film-card .v10-video').count();if(videos!==1)failures.push('Expected exactly one optional video, found '+videos);await page.locator('#chapter-4 .ap-film-next').click();
  await page.waitForFunction(()=>document.querySelector('#main>.v11-stage-active')?.id==='chapter-5',null,{timeout:4500});if(await page.locator('.ap-mosaic .ap-tile').count()!==6)failures.push('Expected 6-tile mosaic');await page.locator('.ap-final-reveal').click();await page.waitForSelector('.ap-final-copy.is-visible',{timeout:4000});const final=await page.locator('.ap-final-title').textContent();if(final!=='QA BUGUN HAMMA NUR SENIKI')failures.push('Final copy roundtrip failed: '+final);
  await page.screenshot({path:path.join(folder,'aurora-'+d.name+'-final.png'),fullPage:false});const end=await page.evaluate(()=>({w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight}));if(end.w>d.width+4)failures.push('Final horizontal overflow '+end.w);if(end.h>d.height+4)failures.push('Final vertical overflow '+end.h);
 }catch(e){failures.push('Test exception: '+e.message)}if(errors.length)failures.push('Browser exceptions: '+errors.join(' | '));results.push({name:d.name,viewport:d.width+'x'+d.height,passed:failures.length===0,failures});await page.close();
}}
finally{await browser.close()}
await fs.writeFile(path.join(folder,'aurora-paper-summary.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));if(results.some(x=>!x.passed))process.exitCode=1;
