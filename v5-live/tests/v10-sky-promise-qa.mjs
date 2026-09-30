import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const folder=path.resolve('v5-live/qa-v10-results');
await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[];
async function active(page){return page.evaluate(()=>document.querySelector('#main > .v11-stage-active')?.id||'')}
async function expectStage(page,id,label){try{await page.waitForFunction(x=>document.querySelector('#main > .v11-stage-active')?.id===x,id,{timeout:5000})}catch{throw new Error(`${label}: expected ${id}, got ${await active(page)}`)}}
async function run(viewport,name){
 const page=await browser.newPage({viewport,deviceScaleFactor:1,hasTouch:name!=='desktop',isMobile:name!=='desktop'});const failures=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  const res=await page.goto(base+'/templates/v10-proposal-sky.html?qa=sky',{waitUntil:'domcontentloaded',timeout:45000});if(res.status()!==200)failures.push('HTTP '+res.status());
  await page.waitForFunction(()=>window.__EMORA_V10_READY__?.template==='proposal-sky-promise',{timeout:15000});
  await page.waitForFunction(()=>window.__EMORA_SKY_PROMISE__?.flagship===true,{timeout:6000});
  await page.evaluate(()=>window.postMessage({type:'emora:preview',config:{recipient:'DILNOZA QA',sender:'AZIZ QA',memoryTitle:'QA BIZNING OSMONIMIZ',captions:['QA oddiy tonglar','QA yangi shaharlar','QA sokin uy'],letter:'QA constellation va’da matni',final:'QA SKY FINAL SAVOL?',video:'https://example.invalid/sky-qa.mp4'}},location.origin));
  await page.waitForTimeout(260);
  const contract=await page.evaluate(()=>({sequence:window.__EMORA_SKY_PROMISE__?.sequence||[],cover:!!document.querySelector('#coverTitle'),scrollWidth:document.documentElement.scrollWidth,width:innerWidth,videos:document.querySelectorAll('.v10-video').length}));
  if(contract.sequence.join('>')!=='sunset-gate>blue-hour>three-dreams>constellation>last-star>proposal')failures.push('Unexpected Sky sequence: '+contract.sequence.join('>'));
  if(!contract.cover)failures.push('Shared V10 cover compatibility node missing');if(contract.scrollWidth>contract.width+4)failures.push('Intro horizontal overflow');if(contract.videos!==1)failures.push('Configured video must exist exactly once before ritual; found '+contract.videos);
  await page.screenshot({path:path.join(folder,`sky-${name}-intro.png`),fullPage:false});
  await page.locator('#openIntro').click();await page.waitForTimeout(1450);await expectStage(page,'chapter-1','intro dismissal');
  const skyName=await page.locator('#chapter-1 .sp-sunset-name').textContent();if(skyName!=='DILNOZA QA')failures.push('Recipient did not reach sunset gate: '+skyName);
  await page.locator('#chapter-1 .sp-sunset-action').click();await expectStage(page,'chapter-2','sunset gate');
  const title=await page.locator('#chapter-2 .sp-sky-name').textContent();if(title!=='QA BIZNING OSMONIMIZ')failures.push('Sky title mismatch: '+title);
  await page.locator('#chapter-2 .sp-dusk-next').click();await expectStage(page,'chapter-3','blue hour');
  const stars=page.locator('#chapter-3 .sp-dream-star');if(await stars.count()!==3)failures.push('Expected 3 dream stars, found '+await stars.count());
  for(let i=0;i<Math.min(3,await stars.count());i++){await stars.nth(i).evaluate(el=>el.click());await page.waitForTimeout(90)}
  const dreams=await page.locator('#chapter-3 .sp-dream-text').allTextContents();if(dreams.join(' | ')!=='QA oddiy tonglar | QA yangi shaharlar | QA sokin uy')failures.push('Dream copy mismatch: '+dreams.join(' | '));
  try{await page.waitForFunction(()=>{const x=document.querySelector('#chapter-3 .sp-dreams-next');return x&&!x.hidden&&x.classList.contains('is-visible')},{timeout:2500})}catch{failures.push('Three dreams did not unlock constellation')}
  await page.screenshot({path:path.join(folder,`sky-${name}-dreams.png`),fullPage:false});
  await page.locator('#chapter-3 .sp-dreams-next').click();await expectStage(page,'chapter-4','dream completion');
  const vow=await page.locator('#chapter-4 .sp-promise-text').textContent();if(vow!=='QA constellation va’da matni')failures.push('Promise mismatch: '+vow);
  const videoCount=await page.locator('#chapter-4 .sp-sky-video .v10-video').count();if(videoCount!==1)failures.push('Optional video must move to constellation scene exactly once; found '+videoCount);
  await page.locator('#chapter-4 .sp-constellation-next').click();await expectStage(page,'chapter-5','constellation completion');
  const last=page.locator('#chapter-5 .sp-last-star');if(await last.count()!==1)failures.push('Last star control missing');else{await last.click();try{await page.waitForFunction(()=>{const x=document.querySelector('#chapter-5 .sp-question');return x&&!x.hidden&&x.classList.contains('is-visible')},{timeout:3500})}catch{failures.push('Last star did not reveal proposal')};const q=await page.locator('#chapter-5 .sp-final-title').textContent();if(q!=='QA SKY FINAL SAVOL?')failures.push('Final question mismatch: '+q);await page.screenshot({path:path.join(folder,`sky-${name}-proposal.png`),fullPage:false})}
  const layout=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,width:innerWidth,scrollHeight:document.documentElement.scrollHeight,height:innerHeight,scrollY}));if(layout.scrollWidth>layout.width+4)failures.push('Final horizontal overflow');if(layout.scrollHeight>layout.height+4)failures.push(`Final vertical scroll ${layout.scrollHeight} > ${layout.height}`);if(layout.scrollY!==0)failures.push('Document scrolling used: '+layout.scrollY);
 }catch(e){failures.push('Test exception: '+e.message)}
 if(errors.length)failures.push('Browser JS exception(s): '+errors.join('; '));results.push({name,viewport:`${viewport.width}x${viewport.height}`,passed:failures.length===0,failures});await page.close();
}
try{await run({width:390,height:844},'mobile');await run({width:360,height:740},'small');await run({width:1440,height:900},'desktop')}finally{await browser.close()}
await fs.writeFile(path.join(folder,'sky-promise-summary.json'),JSON.stringify(results,null,2));console.log(JSON.stringify({tested:results.length,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed)},null,2));if(results.some(x=>!x.passed))process.exitCode=1;
