import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const folder=path.resolve('v5-live/qa-v10-results');
await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
const failures=[],errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 const response=await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:45000});
 if(response.status()!==200)failures.push('Homepage HTTP '+response.status());
 try{await page.waitForFunction(()=>document.querySelectorAll('#categoryGrid .category-card').length===5,null,{timeout:30000})}
 catch{failures.push('Five category cards did not render, frontend module may have failed to load')}
 if(!failures.length){
  await page.screenshot({path:path.join(folder,'platform-home.png'),fullPage:false});
  const groups=['love','wedding','birthday','apology','proposal'];
  for(let i=0;i<groups.length;i++){
   if(i>0){await page.locator('#changeCategory').click();await page.waitForTimeout(120)}
   await page.locator('.category-card[data-category="'+groups[i]+'"]').click();
   await page.waitForTimeout(160);
   const count=await page.locator('#templateCards .card').count();
   if(count!==3)failures.push(groups[i]+' has '+count+' cards instead of 3');
   const slugs=await page.locator('#templateCards [data-use]').evaluateAll(btns=>btns.map(b=>b.dataset.use));
   if(new Set(slugs).size!==3)failures.push(groups[i]+' has repeated template options');
   const first=slugs[0];
   await page.locator('#templateCards [data-use="'+first+'"]').click();
   await page.waitForTimeout(250);
   if(await page.locator('#type').inputValue()!==first)failures.push(groups[i]+' editor template selection failed');
   if(groups[i]==='love'){
    try{await page.frameLocator('#studioIframe').locator('#introName').waitFor({timeout:15000});
     await page.locator('#name1').fill('QA Dilnoza');
     await page.waitForTimeout(400);
     const name=await page.frameLocator('#studioIframe').locator('#introName').textContent();
     if(!name.includes('QA Dilnoza'))failures.push('Live preview did not receive name change');
    }catch(e){failures.push('Live preview integration failed: '+e.message)}
   }
   if(groups[i]==='wedding'){
    const date=await page.locator('#date').inputValue();
    const venue=await page.locator('#venue').inputValue();
    if(date)failures.push('Wedding editor starts with a fictitious date');
    if(venue)failures.push('Wedding editor starts with a fictitious venue');
    await page.locator('#date').fill('2027-06-25');
    await page.locator('#eventClock').fill('17:30');
    await page.locator('#venue').fill('QA To‘yxona');
    await page.waitForTimeout(180);
    const editorTime=await page.locator('#eventClock').inputValue();
    if(editorTime!=='17:30')failures.push('Event time input did not retain edited value');
   }
   if(groups[i]==='proposal'&&first==='proposal-pearl-promise'){
    try{
     await page.waitForFunction(()=>{const x=document.querySelector('#proposalPearlExtra');return x&&!x.classList.contains('hidden')},{timeout:4000});
     const dateHidden=await page.locator('#dateField').evaluate(e=>e.classList.contains('hidden'));
     if(!dateHidden)failures.push('Pearl Promise editor should hide irrelevant event date');
     const labels=await page.locator('#proposalPearlExtra .field > label:first-child').allTextContents();
     if(!labels.some(x=>x.includes('1-SABAB'))||!labels.some(x=>x.includes('2-SABAB'))||!labels.some(x=>x.includes('3-SABAB')))failures.push('Pearl Promise 3-reason editor labels are incomplete: '+labels.join(' | '));
     await page.locator('#mistake').fill('QA sabab bir');
     await page.locator('#repair').fill('QA sabab ikki');
     await page.locator('#venue').fill('QA sabab uch');
     await page.locator('#letter').fill('QA haqiqiy va’da matni');
     await page.locator('#finalQuestion').fill('QA, menga turmushga chiqasanmi?');
     await page.waitForTimeout(650);
     await page.frameLocator('#studioIframe').locator('.pp-reason-text').first().waitFor({timeout:8000,state:'attached'});
     const reasons=await page.frameLocator('#studioIframe').locator('.pp-reason-text').allTextContents();
     if(reasons.join(' | ')!=='QA sabab bir | QA sabab ikki | QA sabab uch')failures.push('Pearl editor reasons did not reach live experience: '+reasons.join(' | '));
     const vow=await page.frameLocator('#studioIframe').locator('.pp-vow-text').textContent();
     if(vow!=='QA haqiqiy va’da matni')failures.push('Pearl promise text did not reach live experience: '+vow);
     const question=await page.frameLocator('#studioIframe').locator('.pp-question-title').textContent();
     if(question!=='QA, menga turmushga chiqasanmi?')failures.push('Pearl final question did not reach live experience: '+question);

     await page.locator('#type').selectOption('proposal-cinema');
     await page.waitForTimeout(550);
     await page.waitForFunction(()=>{const x=document.querySelector('#proposalCinemaExtra');return x&&!x.classList.contains('hidden')},{timeout:5000});
     const cinemaDateHidden=await page.locator('#dateField').evaluate(e=>e.classList.contains('hidden'));
     if(!cinemaDateHidden)failures.push('Cinema Proposal editor should hide irrelevant event date');
     const cinemaLabels=await page.locator('#memoryTitle,#caption1,#caption2,#caption3,#videoUrl,#letter,#finalQuestion').evaluateAll(nodes=>nodes.map(n=>n.closest('.field')?.querySelector('label')?.textContent||''));
     if(!cinemaLabels.some(x=>x.includes('FILM NOMI'))||!cinemaLabels.some(x=>x.includes('01-KADR'))||!cinemaLabels.some(x=>x.includes('VOICE-OVER'))||!cinemaLabels.some(x=>x.includes('FINAL SCENE')))failures.push('Cinema Proposal editor labels are incomplete: '+cinemaLabels.join(' | '));
     await page.locator('#memoryTitle').fill('QA BIZNING FILMIMIZ');
     await page.locator('#caption1').fill('QA birinchi kadr');await page.locator('#caption2').fill('QA ikkinchi kadr');await page.locator('#caption3').fill('QA uchinchi kadr');
     await page.locator('#letter').fill('QA cinema voice-over matni');
     await page.locator('#finalQuestion').fill('QA CINEMA FINAL SAVOL?');
     await page.waitForTimeout(750);
     await page.frameLocator('#studioIframe').locator('.cp-movie-title').first().waitFor({timeout:9000,state:'attached'});
     const cinemaTitle=await page.frameLocator('#studioIframe').locator('.cp-movie-title').first().textContent();
     if(cinemaTitle!=='QA BIZNING FILMIMIZ')failures.push('Cinema movie title did not reach live experience: '+cinemaTitle);
     const cinemaFrames=await page.frameLocator('#studioIframe').locator('.cp-frame-caption').allTextContents();
     if(cinemaFrames.join(' | ')!=='QA birinchi kadr | QA ikkinchi kadr | QA uchinchi kadr')failures.push('Cinema frame captions did not reach live experience: '+cinemaFrames.join(' | '));
     const cinemaVoice=await page.frameLocator('#studioIframe').locator('.cp-voice-text').textContent();
     if(cinemaVoice!=='QA cinema voice-over matni')failures.push('Cinema voice-over did not reach live experience: '+cinemaVoice);
     const cinemaFinal=await page.frameLocator('#studioIframe').locator('.cp-final-title').textContent();
     if(cinemaFinal!=='QA CINEMA FINAL SAVOL?')failures.push('Cinema final question did not reach live experience: '+cinemaFinal);
    }catch(e){failures.push('Proposal flagship Creator Studio integration failed: '+e.message)}
   }
   const image=await page.locator('#templateCards .card-art').first().evaluate(e=>getComputedStyle(e).backgroundImage);
   if(!image.includes('/assets/'))failures.push(groups[i]+' catalog visuals are not first-party assets');
  }
 }
 const uploads=await page.locator('[data-media-upload]').count();
 if(uploads!==5)failures.push('Expected five private file upload inputs, got '+uploads);
 const imagePicker=page.locator('[data-media-upload="photo1"]');
 if(await imagePicker.count()){
  await imagePicker.setInputFiles({name:'test-placeholder.jpg',mimeType:'image/jpeg',buffer:Buffer.from([0xff,0xd8,0xff,0xd9])});
  await page.waitForTimeout(300);
  const authVisible=await page.locator('#accountModal').evaluate(e=>!e.classList.contains('hidden'));
  if(!authVisible)failures.push('Anonymous private media upload must prompt for sign-in');
  await page.locator('#closeAuth').click();
 }
 if(errors.length)failures.push('Homepage browser exceptions: '+errors.join(' | '));
}finally{await page.close();await browser.close()}
const report={passed:failures.length===0,failures,checkedGroups:5,expectedTemplates:15,checks:['category-first','three independent templates per category','editor category selection','live iframe name update','real wedding input','Pearl Promise three reasons/promise/final editor roundtrip','Cinema Proposal film/frames/voice-over/final editor roundtrip','permanent catalog art','browser exceptions','private upload controls and auth gate']};
await fs.writeFile(path.join(folder,'platform-summary.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(!report.passed)process.exitCode=1;
