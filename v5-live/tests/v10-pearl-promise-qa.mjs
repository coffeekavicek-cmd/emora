import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const folder=path.resolve('v5-live/qa-v10-results');
await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[];

async function activeId(page){
 return page.evaluate(()=>document.querySelector('#main > .v11-stage-active')?.id||'');
}
async function expectStage(page,id,label){
 try{await page.waitForFunction(expected=>document.querySelector('#main > .v11-stage-active')?.id===expected,id,{timeout:5000})}
 catch{throw new Error(`${label}: expected ${id}, got ${await activeId(page)}`)}
}
async function run(viewport,name){
 const page=await browser.newPage({viewport,deviceScaleFactor:1,hasTouch:name!=='desktop',isMobile:name!=='desktop'});
 const failures=[];const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  const response=await page.goto(base+'/templates/v10-proposal-pearl.html?qa=pearl',{waitUntil:'domcontentloaded',timeout:45000});
  if(response.status()!==200)failures.push('HTTP '+response.status());
  await page.waitForFunction(()=>window.__EMORA_V10_READY__?.template==='proposal-pearl-promise',{timeout:15000});
  await page.waitForFunction(()=>window.__EMORA_PEARL_PROMISE__?.flagship===true,{timeout:5000});

  await page.evaluate(()=>window.postMessage({type:'emora:preview',config:{
   recipient:'DILNOZA QA',sender:'AZIZ QA',intro:'Senga bitta eng muhim savolim bor…',
   photos:['/assets/proposal-pearl.png','/assets/love-pearl.png','/assets/love-rose.png'],
   captions:['Biz tanishgan kun','Eng sokin baxtim','Kelajak sari'],
   proposalReasons:['Sen bilan uyimni topgandek bo‘laman.','Meni eng yaxshi holimga ilhomlantirasan.','Kelajagimni sen bilan qurishni istayman.'],
   promiseText:'Men faqat chiroyli kunlarda emas, har qanday kunda yoningda bo‘lishni tanlayman.',
   finalQuestion:'DILNOZA, menga turmushga chiqasanmi?',
   video:'https://example.invalid/pearl-promise-qa.mp4'
  }},location.origin));
  await page.waitForTimeout(180);

  const contract=await page.evaluate(()=>({
   introBox:!!document.querySelector('.pp-intro-box'),
   sequence:window.__EMORA_PEARL_PROMISE__?.sequence||[],
   scrollWidth:document.documentElement.scrollWidth,
   width:innerWidth,
   videos:document.querySelectorAll('.v10-video').length
  }));
  if(!contract.introBox)failures.push('Flagship closed-box intro missing');
  if(contract.sequence.join('>')!=='tease>memories>reasons>vow>ring>proposal')failures.push('Unexpected Pearl ritual sequence: '+contract.sequence.join('>'));
  if(contract.scrollWidth>contract.width+4)failures.push(`Intro horizontal overflow ${contract.scrollWidth} > ${contract.width}`);
  if(contract.videos!==1)failures.push('Configured video must exist exactly once before ritual; found '+contract.videos);
  await page.screenshot({path:path.join(folder,`pearl-${name}-intro.png`),fullPage:false});

  await page.locator('#openIntro').click();
  await page.waitForTimeout(1500);
  await expectStage(page,'chapter-1','intro dismissal');
  await page.locator('#chapter-1 .v10-cta').click();
  await expectStage(page,'chapter-2','story start');

  const teaser=page.locator('#chapter-2 .pp-peek-button');
  if(await teaser.count()!==1)failures.push('Pearl closed-box teaser button missing');
  else{
   const ringOpacity=await page.locator('#chapter-2 .pp-ring').evaluate(el=>getComputedStyle(el).opacity);
   if(Number(ringOpacity)>.1)failures.push('Ring is visible too early in teaser');
   await teaser.click();
   await expectStage(page,'chapter-3','closed-box teaser');
  }

  const cards=page.locator('#chapter-3 .pp-memory-card');
  if(await cards.count()!==3)failures.push('Expected 3 Pearl memory cards, found '+await cards.count());
  for(let i=0;i<Math.min(3,await cards.count());i++){await cards.nth(i).click();await page.waitForTimeout(90)}
  try{await page.waitForFunction(()=>{const x=document.querySelector('#chapter-3 .pp-reasons');return x&&!x.hidden&&x.classList.contains('is-visible')},{timeout:3000})}
  catch{failures.push('Three memories did not reveal the reasons panel')}

  const reasons=page.locator('#chapter-3 .pp-reason-button');
  if(await reasons.count()!==3)failures.push('Expected 3 sincere reason interactions, found '+await reasons.count());
  for(let i=0;i<Math.min(3,await reasons.count());i++){await reasons.nth(i).click();await page.waitForTimeout(70)}
  const reasonCopy=await page.locator('#chapter-3 .pp-reason-text').allTextContents();
  if(!reasonCopy.some(x=>x.includes('uyimni topgandek')))failures.push('Custom proposal reasons did not round-trip into the experience');
  try{await page.waitForFunction(()=>{const x=document.querySelector('#chapter-3 .pp-story-continue');return x&&!x.hidden&&x.classList.contains('is-visible')},{timeout:2500})}
  catch{failures.push('Reasons did not unlock vow continuation')}
  await page.screenshot({path:path.join(folder,`pearl-${name}-reasons.png`),fullPage:false});

  const continueButton=page.locator('#chapter-3 .pp-story-continue');
  if(await continueButton.count()){
   await continueButton.click();await expectStage(page,'chapter-4','reasons completion');
   const vow=await page.locator('#chapter-4 .pp-vow-text').textContent();
   if(!vow?.includes('har qanday kunda'))failures.push('Custom promise text missing from vow scene');
   const vowVideos=await page.locator('#chapter-4 .pp-vow-video .v10-video').count();
   if(vowVideos!==1)failures.push('Optional video must live inside the vow scene exactly once; found '+vowVideos);
   const allVideos=await page.locator('.v10-video').count();
   if(allVideos!==1)failures.push('Optional video duplicated during Pearl ritual; found '+allVideos);
   await page.locator('#chapter-4 .pp-vow-footer .v10-cta').click();
   await expectStage(page,'chapter-5','vow completion');
  }

  const openRing=page.locator('#chapter-5 .pp-open-ring');
  if(await openRing.count()!==1)failures.push('Final ring-box control missing');
  else{
   const hiddenBefore=await page.locator('#chapter-5 .pp-question-wrap').evaluate(el=>el.hidden);
   if(!hiddenBefore)failures.push('Proposal question appears before ring box is opened');
   await openRing.click();
   try{await page.waitForFunction(()=>{const x=document.querySelector('#chapter-5 .pp-question-wrap');return x&&!x.hidden&&x.classList.contains('is-visible')},{timeout:3500})}
   catch{failures.push('Ring opening did not reveal the proposal question')}
   const title=await page.locator('#chapter-5 .pp-question-title').textContent();
   if(title!=='DILNOZA, menga turmushga chiqasanmi?')failures.push('Custom final question mismatch: '+title);
   const actions=page.locator('#chapter-5 .pp-question-actions button');
   if(await actions.count()!==2)failures.push('Proposal finale must retain two respectful choices; found '+await actions.count());
   await page.screenshot({path:path.join(folder,`pearl-${name}-proposal.png`),fullPage:false});
   if(await actions.count()>=2){
    await actions.nth(1).click();
    const feedback=await page.locator('#chapter-5 .v10-final-feedback').textContent();
    if(!feedback?.includes('hurmat qilaman'))failures.push('Respectful alternate choice is not functional');
   }
  }

  const finalLayout=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,width:innerWidth,scrollHeight:document.documentElement.scrollHeight,height:innerHeight,scrollY}));
  if(finalLayout.scrollWidth>finalLayout.width+4)failures.push(`Final horizontal overflow ${finalLayout.scrollWidth} > ${finalLayout.width}`);
  if(finalLayout.scrollHeight>finalLayout.height+4)failures.push(`Final vertical document scroll ${finalLayout.scrollHeight} > ${finalLayout.height}`);
  if(finalLayout.scrollY!==0)failures.push('Pearl ritual used document scrolling: '+finalLayout.scrollY);
 }catch(e){failures.push('Test exception: '+e.message)}
 if(errors.length)failures.push('Browser JS exception(s): '+errors.join('; '));
 const result={name,viewport:`${viewport.width}x${viewport.height}`,passed:failures.length===0,failures};results.push(result);
 await page.close();
}

try{
 await run({width:390,height:844},'mobile');
 await run({width:360,height:740},'small');
 await run({width:1440,height:900},'desktop');
}finally{await browser.close()}

await fs.writeFile(path.join(folder,'pearl-promise-summary.json'),JSON.stringify(results,null,2));
console.log(JSON.stringify({tested:results.length,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed)},null,2));
if(results.some(x=>!x.passed))process.exitCode=1;
