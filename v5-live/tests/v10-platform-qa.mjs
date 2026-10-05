import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const folder=path.resolve('v5-live/qa-v10-results');await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
const failures=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
const flagships={
 love:{slug:'love-rose-theatre',name:'Rose Theatre'},
 wedding:{slug:'wedding-silk-heritage',name:'Silk Heritage'},
 birthday:{slug:'birthday-aurora-paper',name:'Aurora Paper'},
 apology:{slug:'apology-quiet-room',name:'Quiet Room'},
 proposal:{slug:'proposal-pearl-promise',name:'Pearl Promise'}
};
try{
 const response=await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:45000});if(response.status()!==200)failures.push('Homepage HTTP '+response.status());
 try{await page.waitForFunction(()=>document.documentElement.dataset.emoraCatalog==='five-flagships'&&document.querySelectorAll('#categoryGrid .category-card').length===5,null,{timeout:30000})}catch{failures.push('Curated five catalog did not render')}
 if(!failures.length){
  await page.screenshot({path:path.join(folder,'platform-home.png'),fullPage:false});
  const groups=Object.keys(flagships);
  for(let i=0;i<groups.length;i++){
   const group=groups[i],expected=flagships[group];
   if(i>0){await page.locator('#changeCategory').click();await page.waitForTimeout(150)}
   await page.locator('.category-card[data-category="'+group+'"]').click();await page.waitForTimeout(220);
   const cards=page.locator('#templateCards .card');const count=await cards.count();if(count!==1)failures.push(group+' has '+count+' public cards instead of 1 curated flagship');
   if(count===1){const name=(await cards.first().locator('h3').textContent())?.trim();if(name!==expected.name)failures.push(group+' public flagship '+name+' != '+expected.name);const slug=await cards.first().locator('[data-use]').getAttribute('data-use');if(slug!==expected.slug)failures.push(group+' public flagship slug '+slug+' != '+expected.slug)}
   const options=page.locator('#type option');if(await options.count()!==1)failures.push(group+' Creator Studio exposes '+await options.count()+' options instead of 1');else if(await options.first().getAttribute('value')!==expected.slug)failures.push(group+' editor option is not '+expected.slug);
   await cards.first().locator('[data-use]').click();await page.waitForTimeout(300);if(await page.locator('#type').inputValue()!==expected.slug)failures.push(group+' editor template selection failed');
   if(group==='love'){
    try{await page.frameLocator('#studioIframe').locator('#introName').waitFor({timeout:15000});await page.locator('#name1').fill('QA Dilnoza');await page.waitForTimeout(450);const name=await page.frameLocator('#studioIframe').locator('#introName').textContent();if(!name.includes('QA Dilnoza'))failures.push('Rose live preview did not receive name change');
    const rosePhotos=await Promise.all(['photo1','photo2','photo3'].map(id=>page.locator('#'+id).evaluate(n=>getComputedStyle(n.closest('.field')).display!=='none')));if(rosePhotos.some(x=>!x))failures.push('Rose Creator Studio does not expose three personal photo fields');}catch(e){failures.push('Rose Creator Studio integration failed: '+e.message)}
   }
   if(group==='wedding'){
    const date=await page.locator('#date').inputValue(),venue=await page.locator('#venue').inputValue();if(date)failures.push('Wedding editor starts with a fictitious date');if(venue)failures.push('Wedding editor starts with a fictitious venue');await page.locator('#date').fill('2027-06-25');await page.locator('#eventClock').fill('17:30');await page.locator('#venue').fill('QA To‘yxona');await page.waitForTimeout(180);if(await page.locator('#eventClock').inputValue()!=='17:30')failures.push('Event time input did not retain edited value');
   }
   if(group==='apology'){
    try{await page.locator('#mistake').fill('QA aniq xato');await page.locator('#repair').fill('QA konkret tuzatish');await page.waitForTimeout(500);const mistake=await page.frameLocator('#studioIframe').locator('.qr-honest-text').textContent(),repair=await page.frameLocator('#studioIframe').locator('.qr-repair-text').textContent();if(mistake!=='QA aniq xato'||repair!=='QA konkret tuzatish')failures.push('Quiet Room mistake/repair did not round-trip')}catch(e){failures.push('Quiet Room Creator Studio integration failed: '+e.message)}
   }
   if(group==='proposal'){
    try{await page.waitForFunction(()=>{const x=document.querySelector('#proposalPearlExtra');return x&&!x.classList.contains('hidden')},{timeout:5000});if(!(await page.locator('#dateField').evaluate(e=>e.classList.contains('hidden'))))failures.push('Pearl Promise editor should hide irrelevant event date');
    await page.locator('#mistake').fill('QA sabab bir');await page.locator('#repair').fill('QA sabab ikki');await page.locator('#venue').fill('QA sabab uch');await page.locator('#letter').fill('QA haqiqiy va’da matni');await page.locator('#finalQuestion').fill('QA, menga turmushga chiqasanmi?');await page.waitForTimeout(700);const reasons=await page.frameLocator('#studioIframe').locator('.pp-reason-text').allTextContents();if(reasons.join(' | ')!=='QA sabab bir | QA sabab ikki | QA sabab uch')failures.push('Pearl editor reasons did not round-trip');if(await page.frameLocator('#studioIframe').locator('.pp-vow-text').textContent()!=='QA haqiqiy va’da matni')failures.push('Pearl promise text did not round-trip');}catch(e){failures.push('Pearl Promise Creator Studio integration failed: '+e.message)}
   }
   const image=await cards.first().locator('.card-art').evaluate(e=>getComputedStyle(e).backgroundImage);if(!image.includes('/assets/'))failures.push(group+' catalog visual is not a first-party asset');
  }
 }
 // Hidden legacy experiences must remain routable for compatibility, but not be public catalog/editor options.
 const compatibility=['/templates/v10-love-pearl.html','/templates/v10-love-galaxy.html','/templates/v10-wedding-garden.html','/templates/v10-wedding-naqsh.html','/templates/v10-birthday-balloon.html','/templates/v10-birthday-memory.html','/templates/v10-apology-rain.html','/templates/v10-apology-ink.html','/templates/v10-proposal-cinema.html','/templates/v10-proposal-sky.html'];
 for(const url of compatibility){const status=await page.evaluate(async u=>(await fetch(u,{method:'HEAD'})).status,url);if(status!==200)failures.push('Compatibility route failed '+url+' HTTP '+status)}
 const uploads=await page.locator('[data-media-upload]').count();if(uploads!==5)failures.push('Expected five private file upload inputs, got '+uploads);
 const imagePicker=page.locator('[data-media-upload="photo1"]');if(await imagePicker.count()){await imagePicker.setInputFiles({name:'test-placeholder.jpg',mimeType:'image/jpeg',buffer:Buffer.from([0xff,0xd8,0xff,0xd9])});await page.waitForTimeout(300);if(!(await page.locator('#accountModal').evaluate(e=>!e.classList.contains('hidden'))))failures.push('Anonymous private media upload must prompt for sign-in');await page.locator('#closeAuth').click()}
 if(errors.length)failures.push('Homepage browser exceptions: '+errors.join(' | '));
}finally{await page.close();await browser.close()}
const report={passed:failures.length===0,failures,checkedGroups:5,publicFlagships:5,compatibleTemplates:15,checks:['category-first curated five','one flagship per category','editor flagship selection','live flagship roundtrips','real wedding input','first-party catalog art','10 hidden compatibility routes','browser exceptions','private upload controls and auth gate']};await fs.writeFile(path.join(folder,'platform-summary.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.passed)process.exitCode=1;