import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const folder=path.resolve('v5-live/qa-v10-results');
await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const results=[];

async function activeId(page){return page.evaluate(()=>document.querySelector('#main > .v11-stage-active')?.id||'')}
async function expectStage(page,id,label){try{await page.waitForFunction(expected=>document.querySelector('#main > .v11-stage-active')?.id===expected,id,{timeout:5500})}catch{throw new Error(`${label}: expected ${id}, got ${await activeId(page)}`)}}
async function run(viewport,name){
 const page=await browser.newPage({viewport,deviceScaleFactor:1,hasTouch:name!=='desktop',isMobile:name!=='desktop'});
 const failures=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  const response=await page.goto(base+'/templates/v10-proposal-cinema.html?qa=cinema',{waitUntil:'domcontentloaded',timeout:45000});
  if(response.status()!==200)failures.push('HTTP '+response.status());
  await page.waitForFunction(()=>window.__EMORA_V10_READY__?.template==='proposal-cinema',{timeout:15000});
  await page.waitForFunction(()=>window.__EMORA_CINEMA_PROPOSAL__?.flagship===true,{timeout:6000});
  await page.evaluate(()=>window.postMessage({type:'emora:preview',config:{
   recipient:'DILNOZA QA',sender:'AZIZ QA',memoryTitle:'BIZNING FILMIMIZ',
   photos:['/assets/proposal-cinema.png','/assets/love-rose.png','/assets/proposal-pearl.png'],
   captions:['Birinchi uchrashuv','Eng sevimli sahnam','Men tanlagan kelajak'],
   letter:'Men ssenariy yozib qo‘ymadim. Faqat bitta narsani bilaman: qolgan hayotimdagi barcha sahnalarni sen bilan ko‘rishni istayman.',
   finalQuestion:'DILNOZA, menga turmushga chiqasanmi?',video:'https://example.invalid/cinema-qa.mp4'
  }},location.origin));
  await page.waitForTimeout(280);
  const contract=await page.evaluate(()=>({flag:window.__EMORA_CINEMA_PROPOSAL__,marquee:!!document.querySelector('.cp-marquee'),scrollWidth:document.documentElement.scrollWidth,width:innerWidth,videos:document.querySelectorAll('.v10-video').length}));
  if(contract.flag?.sequence?.join('>')!=='ticket>countdown>trailer>frames>voiceover>final-scene>proposal')failures.push('Unexpected cinema sequence: '+(contract.flag?.sequence||[]).join('>'));
  if(!contract.marquee)failures.push('Cinema marquee intro missing');
  if(contract.scrollWidth>contract.width+4)failures.push(`Intro horizontal overflow ${contract.scrollWidth} > ${contract.width}`);
  if(contract.videos!==1)failures.push('Personal trailer must exist once; found '+contract.videos);
  await page.screenshot({path:path.join(folder,`cinema-${name}-intro.png`),fullPage:false});

  await page.locator('#openIntro').click();await page.waitForTimeout(1450);await expectStage(page,'chapter-1','intro dismissal');
  const movie=await page.locator('#chapter-1 .cp-movie-title').textContent();if(movie!=='BIZNING FILMIMIZ')failures.push('Custom movie title mismatch: '+movie);
  const ticketName=await page.locator('#chapter-1 .cp-ticket-name').textContent();if(ticketName!=='DILNOZA QA')failures.push('Ticket recipient mismatch: '+ticketName);
  await page.locator('#chapter-1 .cp-ticket-enter').click();await expectStage(page,'chapter-2','ticket tear');

  const projector=page.locator('#chapter-2 .cp-projector-start');if(await projector.count()!==1)failures.push('Projector start control missing');else await projector.click();
  try{await page.waitForFunction(()=>{const x=document.querySelector('#chapter-2 .cp-trailer-next');return x&&!x.hidden&&x.classList.contains('is-visible')},{timeout:4500})}catch{failures.push('Projector countdown did not reveal trailer continuation')}
  const trailerVideos=await page.locator('#chapter-2 .cp-video-slot .v10-video').count();if(trailerVideos!==1)failures.push('Trailer video not placed inside cinema screen exactly once: '+trailerVideos);
  await page.screenshot({path:path.join(folder,`cinema-${name}-trailer.png`),fullPage:false});
  await page.locator('#chapter-2 .cp-trailer-next').click();await expectStage(page,'chapter-3','trailer completion');

  const cards=page.locator('#chapter-3 .cp-frame-card');if(await cards.count()!==3)failures.push('Expected 3 cinema frames, found '+await cards.count());
  const captions=await page.locator('#chapter-3 .cp-frame-caption').allTextContents();if(captions.join(' | ')!=='Birinchi uchrashuv | Eng sevimli sahnam | Men tanlagan kelajak')failures.push('Cinema frame captions mismatch: '+captions.join(' | '));
  for(let i=0;i<Math.min(3,await cards.count());i++){await cards.nth(i).evaluate(el=>el.click());await page.waitForTimeout(80)}
  try{await page.waitForFunction(()=>{const x=document.querySelector('#chapter-3 .cp-frames-next');return x&&!x.hidden&&x.classList.contains('is-visible')},{timeout:2500})}catch{failures.push('Three film frames did not unlock continuation')}
  await page.screenshot({path:path.join(folder,`cinema-${name}-frames.png`),fullPage:false});
  await page.locator('#chapter-3 .cp-frames-next').click();await expectStage(page,'chapter-4','frames completion');

  const voice=await page.locator('#chapter-4 .cp-voice-text').textContent();if(!voice?.includes('qolgan hayotimdagi barcha sahnalarni'))failures.push('Custom voice-over text missing: '+voice);
  await page.locator('#chapter-4 .cp-voice-next').click();await expectStage(page,'chapter-5','voice-over completion');

  const question=page.locator('#chapter-5 .cp-question');if(!(await question.evaluate(el=>el.hidden)))failures.push('Proposal question appears before FINAL SCENE reveal');
  await page.locator('#chapter-5 .cp-final-reveal').click();
  try{await page.waitForFunction(()=>{const x=document.querySelector('#chapter-5 .cp-question');return x&&!x.hidden&&x.classList.contains('is-visible')},{timeout:3500})}catch{failures.push('Final curtain did not reveal proposal question')}
  const final=await page.locator('#chapter-5 .cp-final-title').textContent();if(final!=='DILNOZA, menga turmushga chiqasanmi?')failures.push('Final proposal question mismatch: '+final);
  const actions=page.locator('#chapter-5 .v10-final-actions button');if(await actions.count()!==2)failures.push('Cinema proposal must retain two respectful choices; found '+await actions.count());
  await page.screenshot({path:path.join(folder,`cinema-${name}-proposal.png`),fullPage:false});

  const layout=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,width:innerWidth,scrollHeight:document.documentElement.scrollHeight,height:innerHeight,scrollY}));
  if(layout.scrollWidth>layout.width+4)failures.push(`Final horizontal overflow ${layout.scrollWidth} > ${layout.width}`);
  if(layout.scrollHeight>layout.height+4)failures.push(`Final vertical document scroll ${layout.scrollHeight} > ${layout.height}`);
  if(layout.scrollY!==0)failures.push('Cinema ritual used document scrolling: '+layout.scrollY);
 }catch(e){failures.push('Test exception: '+e.message)}
 if(errors.length)failures.push('Browser JS exception(s): '+errors.join('; '));
 results.push({name,viewport:`${viewport.width}x${viewport.height}`,passed:failures.length===0,failures});await page.close();
}
try{await run({width:390,height:844},'mobile');await run({width:360,height:740},'small');await run({width:1440,height:900},'desktop')}finally{await browser.close()}
await fs.writeFile(path.join(folder,'cinema-proposal-summary.json'),JSON.stringify(results,null,2));
console.log(JSON.stringify({tested:results.length,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed)},null,2));
if(results.some(x=>!x.passed))process.exitCode=1;
