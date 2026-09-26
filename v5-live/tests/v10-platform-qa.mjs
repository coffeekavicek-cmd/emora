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
   const image=await page.locator('#templateCards .card-art').first().evaluate(e=>getComputedStyle(e).backgroundImage);
   if(!image.includes('/assets/'))failures.push(groups[i]+' catalog visuals are not first-party assets');
  }
 }
 // Anonymous visitors can preview but must authenticate before uploading private media.
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
const report={passed:failures.length===0,failures,checkedGroups:5,expectedTemplates:15,checks:['category-first','three independent templates per category','editor category selection','live iframe name update','real wedding input','permanent catalog art','browser exceptions','private upload controls and auth gate']};
await fs.writeFile(path.join(folder,'platform-summary.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
if(!report.passed)process.exitCode=1;
