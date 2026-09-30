import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const folder=path.resolve('v5-live/qa-v10-results');await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});const failures=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 const res=await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:45000});if(res.status()!==200)failures.push('Homepage HTTP '+res.status());
 await page.waitForFunction(()=>document.querySelector('#type')&&document.querySelectorAll('#categoryGrid .category-card').length===5,null,{timeout:30000});
 await page.locator('#type').selectOption('apology-quiet-room');await page.waitForTimeout(900);
 try{await page.waitForFunction(()=>{const x=document.querySelector('#apologyQuietExtra');return x&&!x.classList.contains('hidden')},{timeout:5000})}catch{failures.push('Quiet Room editor note did not appear')}
 if(!(await page.locator('#dateField').evaluate(e=>e.classList.contains('hidden'))))failures.push('Quiet Room must hide irrelevant event date');
 const labels=await page.locator('#memoryTitle,#mistake,#repair,#caption1,#caption2,#caption3,#letter,#videoUrl,#finalQuestion').evaluateAll(nodes=>nodes.map(n=>n.closest('.field')?.querySelector('label')?.textContent||''));
 for(const expected of ['XONA / KIRISH SATRI','ANIQ TAN OLISH','MEN BOSHQA NIMA QILAMAN','TINGLASH SATRI · 01','YOZILMAY QOLGAN GAPLAR','AUTOPLAY YO‘Q','HURMATLI YAKUN'])if(!labels.some(x=>x.includes(expected)))failures.push('Missing Quiet Room editor label: '+expected+' | '+labels.join(' | '));
 await page.locator('#name1').fill('QA DILNOZA');await page.locator('#name2').fill('QA AZIZ');await page.locator('#memoryTitle').fill('QA PRIVATE ROOM');await page.locator('#mistake').fill('QA xatoni bahonasiz tan olaman');await page.locator('#repair').fill('QA amalda tinglayman');await page.locator('#caption1').fill('QA hislaringni inkor qilmayman');await page.locator('#caption2').fill('QA shoshilishing shart emas');await page.locator('#caption3').fill('QA qaroringni hurmat qilaman');await page.locator('#letter').fill('QA yozilmay qolgan gaplar');await page.locator('#finalQuestion').fill('QA qaroring muhim');await page.waitForTimeout(1000);
 const frame=page.frameLocator('#studioIframe');await frame.locator('.qr-gate-title').waitFor({timeout:10000,state:'attached'});
 if(await frame.locator('.qr-gate-title').textContent()!=='QA PRIVATE ROOM')failures.push('Room title did not round-trip');if(await frame.locator('.qr-person').textContent()!=='QA DILNOZA')failures.push('Recipient did not round-trip');if(await frame.locator('.qr-honest-text').textContent()!=='QA xatoni bahonasiz tan olaman')failures.push('Mistake text did not round-trip');if(await frame.locator('.qr-repair-text').textContent()!=='QA amalda tinglayman')failures.push('Repair text did not round-trip');if(await frame.locator('.qr-unsaid-text').textContent()!=='QA yozilmay qolgan gaplar')failures.push('Letter did not round-trip');if(await frame.locator('.qr-final-title').textContent()!=='QA qaroring muhim')failures.push('Final title did not round-trip');
 const listen=await frame.locator('.qr-listen-line').allTextContents();if(listen.join(' | ')!=='QA hislaringni inkor qilmayman | QA shoshilishing shart emas | QA qaroringni hurmat qilaman')failures.push('Listening lines did not round-trip: '+listen.join(' | '));
 await page.screenshot({path:path.join(folder,'quiet-editor.png'),fullPage:false});
 if(errors.length)failures.push('Browser exception(s): '+errors.join(' | '));
}catch(e){failures.push('Editor QA exception: '+e.message)}finally{await page.close();await browser.close()}
const report={passed:failures.length===0,failures,checks:['Quiet Room labels','date hidden','recipient/title/mistake/repair/listening/letter/final roundtrip','browser exceptions']};await fs.writeFile(path.join(folder,'quiet-room-editor-summary.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.passed)process.exitCode=1;
