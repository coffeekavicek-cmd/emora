import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const folder=path.resolve('v5-live/qa-v10-results');
await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[];
async function active(page){return page.evaluate(()=>document.querySelector('#main > .v11-stage-active')?.id||'')}
async function expectStage(page,id,label){try{await page.waitForFunction(x=>document.querySelector('#main > .v11-stage-active')?.id===x,id,{timeout:5500})}catch{throw new Error(`${label}: expected ${id}, got ${await active(page)}`)}}
async function configure(page){
 await page.evaluate(()=>window.postMessage({type:'emora:preview',config:{
  recipient:'DILNOZA QA',sender:'AZIZ QA',memoryTitle:'QA SOKIN XONA',
  mistake:'QA men aytgan gapim seni ranjitganini aniq tan olaman.',
  repair:'QA keyingi safar avval tinglayman va chegarangni hurmat qilaman.',
  captions:['QA hislaringni inkor qilmayman.','QA javobni hozir berishing shart emas.','QA qaroringni hurmat qilaman.'],
  letter:'QA bu matn seni ko‘ndirish uchun emas — javobgarligimni aytish uchun.',
  final:'QA SENING VAQTING MUHIM.',photos:['/assets/apology-quiet.png'],video:'https://example.invalid/quiet-room-qa.mp4'
 }},location.origin));
 await page.waitForTimeout(280);
}
async function run(viewport,name){
 const page=await browser.newPage({viewport,deviceScaleFactor:1,hasTouch:name!=='desktop',isMobile:name!=='desktop'});const failures=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  const res=await page.goto(base+'/templates/v10-apology-quiet.html?qa=quiet',{waitUntil:'domcontentloaded',timeout:45000});if(res.status()!==200)failures.push('HTTP '+res.status());
  await page.waitForFunction(()=>window.__EMORA_V10_READY__?.template==='apology-quiet-room',{timeout:15000});
  await page.waitForFunction(()=>window.__EMORA_QUIET_ROOM__?.flagship===true,{timeout:6000});
  await configure(page);
  const contract=await page.evaluate(()=>({sequence:window.__EMORA_QUIET_ROOM__?.sequence||[],pressureFree:window.__EMORA_QUIET_ROOM__?.pressureFree,cover:!!document.querySelector('#coverTitle'),scrollWidth:document.documentElement.scrollWidth,width:innerWidth,videos:document.querySelectorAll('.v10-video').length}));
  if(contract.sequence.join('>')!=='room>lamp>listen>unsaid>response')failures.push('Unexpected Quiet Room sequence: '+contract.sequence.join('>'));
  if(contract.pressureFree!==true)failures.push('Pressure-free contract missing');if(!contract.cover)failures.push('Shared V10 cover compatibility node missing');if(contract.scrollWidth>contract.width+4)failures.push('Intro horizontal overflow');if(contract.videos!==1)failures.push('Configured video must exist exactly once before ritual; found '+contract.videos);
  await page.screenshot({path:path.join(folder,`quiet-${name}-intro.png`),fullPage:false});
  await page.locator('#openIntro').click();await page.waitForTimeout(1450);await expectStage(page,'chapter-1','intro dismissal');
  const gateTitle=await page.locator('#chapter-1 .qr-gate-title').textContent();if(gateTitle!=='QA SOKIN XONA')failures.push('Custom room title mismatch: '+gateTitle);
  const person=await page.locator('#chapter-1 .qr-person').textContent();if(person!=='DILNOZA QA')failures.push('Recipient mismatch: '+person);
  await page.locator('#chapter-1 .qr-enter').click();await expectStage(page,'chapter-2','room gate');
  const honestHidden=await page.locator('#chapter-2 .qr-honest').evaluate(el=>el.hidden);if(!honestHidden)failures.push('Accountability text visible before lamp is switched on');
  await page.locator('#chapter-2 .qr-lamp-switch').click();
  try{await page.waitForFunction(()=>{const x=document.querySelector('#chapter-2 .qr-honest');return x&&!x.hidden&&x.classList.contains('is-visible')},{timeout:2500})}catch{failures.push('Lamp did not reveal accountability text')}
  const honest=await page.locator('#chapter-2 .qr-honest-text').textContent();if(honest!=='QA men aytgan gapim seni ranjitganini aniq tan olaman.')failures.push('Mistake/accountability roundtrip mismatch: '+honest);
  await page.screenshot({path:path.join(folder,`quiet-${name}-lamp.png`),fullPage:false});
  await page.locator('#chapter-2 .qr-lamp-next').click();await expectStage(page,'chapter-3','lamp completion');
  const listen=await page.locator('#chapter-3 .qr-listen-line').allTextContents();if(listen.join(' | ')!=='QA hislaringni inkor qilmayman. | QA javobni hozir berishing shart emas. | QA qaroringni hurmat qilaman.')failures.push('Listening lines mismatch: '+listen.join(' | '));
  const listenChoices=page.locator('#chapter-3 .qr-listen-actions button');if(await listenChoices.count()!==2)failures.push('Listening stage must expose continue and stop choices');
  await page.locator('#chapter-3 .qr-continue').click();await expectStage(page,'chapter-4','listening continue');
  const letter=await page.locator('#chapter-4 .qr-unsaid-text').textContent();if(letter!=='QA bu matn seni ko‘ndirish uchun emas — javobgarligimni aytish uchun.')failures.push('Unsaid letter mismatch: '+letter);
  const repair=await page.locator('#chapter-4 .qr-repair-text').textContent();if(repair!=='QA keyingi safar avval tinglayman va chegarangni hurmat qilaman.')failures.push('Repair plan mismatch: '+repair);
  const quietVideo=page.locator('#chapter-4 .qr-video .v10-video');if(await quietVideo.count()!==1)failures.push('Optional video must move to Quiet Room unsaid scene exactly once; found '+await quietVideo.count());else{const autoplay=await quietVideo.evaluate(v=>v.autoplay||!v.paused);if(autoplay)failures.push('Quiet Room video must never autoplay')}
  const photoVisible=await page.locator('#chapter-4 .qr-memory-photo').evaluate(el=>!el.hidden);if(!photoVisible)failures.push('Optional Quiet Room photo did not render');
  await page.screenshot({path:path.join(folder,`quiet-${name}-letter.png`),fullPage:false});
  await page.locator('#chapter-4 .qr-unsaid-actions button').first().click();await expectStage(page,'chapter-5','unsaid completion');
  const q=await page.locator('#chapter-5 .qr-final-title').textContent();if(q!=='QA SENING VAQTING MUHIM.')failures.push('Final respectful heading mismatch: '+q);
  const responses=page.locator('#chapter-5 .qr-response');if(await responses.count()!==3)failures.push('Final must show exactly three response choices; found '+await responses.count());
  if(await responses.count()===3){
   const labels=await responses.allTextContents();if(labels.join(' | ')!=='Hozir gaplashamiz | Menga vaqt kerak | Javob bermayman')failures.push('Final response labels changed: '+labels.join(' | '));
   await responses.nth(2).click();const noFeedback=await page.locator('#chapter-5 .qr-response-feedback').textContent();if(!noFeedback?.includes('hurmat qilaman'))failures.push('Decline response must be explicitly respected');
   await responses.nth(1).click();const laterFeedback=await page.locator('#chapter-5 .qr-response-feedback').textContent();if(!laterFeedback?.includes('shoshilish yo‘q'))failures.push('Time-needed response must be respected');
  }
  await page.screenshot({path:path.join(folder,`quiet-${name}-response.png`),fullPage:false});
  const layout=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,width:innerWidth,scrollHeight:document.documentElement.scrollHeight,height:innerHeight,scrollY}));if(layout.scrollWidth>layout.width+4)failures.push('Final horizontal overflow');if(layout.scrollHeight>layout.height+4)failures.push(`Final vertical scroll ${layout.scrollHeight} > ${layout.height}`);if(layout.scrollY!==0)failures.push('Document scrolling used: '+layout.scrollY);
 }catch(e){failures.push('Test exception: '+e.message)}
 if(errors.length)failures.push('Browser JS exception(s): '+errors.join('; '));results.push({name,viewport:`${viewport.width}x${viewport.height}`,passed:failures.length===0,failures});await page.close();
}
async function earlyExit(){
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true});const failures=[];
 try{
  await page.goto(base+'/templates/v10-apology-quiet.html?qa=quiet-early',{waitUntil:'domcontentloaded',timeout:45000});await page.waitForFunction(()=>window.__EMORA_QUIET_ROOM__?.flagship===true,{timeout:15000});await configure(page);
  await page.locator('#openIntro').click();await page.waitForTimeout(1450);await expectStage(page,'chapter-1','early intro');await page.locator('#chapter-1 .qr-enter').click();await expectStage(page,'chapter-2','early room');await page.locator('#chapter-2 .qr-lamp-switch').click();await page.locator('#chapter-2 .qr-lamp-next').click();await expectStage(page,'chapter-3','early lamp');
  await page.locator('#chapter-3 .qr-stop').click();await expectStage(page,'chapter-5','respectful early exit');const copy=await page.locator('#chapter-5 .qr-final-copy').textContent();if(!copy?.includes('to‘xtashingni tanlading'))failures.push('Early exit did not produce respectful final copy: '+copy);
 }catch(e){failures.push('Early-exit exception: '+e.message)}
 results.push({name:'early-exit',viewport:'390x844',passed:failures.length===0,failures});await page.close();
}
try{await run({width:390,height:844},'mobile');await run({width:360,height:740},'small');await run({width:1440,height:900},'desktop');await earlyExit()}finally{await browser.close()}
await fs.writeFile(path.join(folder,'quiet-room-summary.json'),JSON.stringify(results,null,2));console.log(JSON.stringify({tested:results.length,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed)},null,2));if(results.some(x=>!x.passed))process.exitCode=1;
