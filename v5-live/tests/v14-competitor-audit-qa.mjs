import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const folder=path.resolve('v5-live/qa-v10-results');await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const failures=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
const wait=ms=>page.waitForTimeout(ms);
async function fill(id,value){await page.locator('#'+id).fill(value);await wait(40)}
try{
 const r=await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:45000});if(r.status()!==200)failures.push('Home HTTP '+r.status());
 await page.waitForFunction(()=>window.__EMORA_V14_AUDIT__?.version===14,null,{timeout:10000});await wait(600);
 const health=await (await fetch(base+'/health')).json();if(health.version!==14)failures.push('Health version is not 14');
 const cards=page.locator('.category-card');if(await cards.count()!==5)failures.push('Expected exactly 5 category cards');
 for(const group of ['love','wedding','birthday','apology','proposal']){const c=page.locator('.category-card[data-category="'+group+'"]');if(await c.count()!==1)failures.push('Missing category '+group);if(await c.locator('.v14-category-actions button').count()!==2)failures.push(group+' direct actions missing')}
 const opts=await page.locator('#type option').evaluateAll(ns=>ns.map(n=>n.value));const expected=['love-rose-theatre','wedding-silk-heritage','birthday-aurora-paper','apology-quiet-room','proposal-pearl-promise'];if(opts.length!==5||expected.some(x=>!opts.includes(x)))failures.push('Experience select is not curated five: '+opts.join(','));
 // Direct preview must skip the redundant one-template browsing step.
 await page.locator('.category-card[data-category="love"] .v14-preview').click();await page.waitForSelector('#templateModal:not(.hidden)',{timeout:5000});const previewSrc=await page.locator('#templateIframe').getAttribute('src');if(!String(previewSrc).includes('v10-love-rose.html'))failures.push('Love direct preview opened wrong experience: '+previewSrc);await page.locator('#templateClose').click();
 // Return to category choice, then start Birthday directly.
 await page.locator('#changeCategory').click();await page.waitForSelector('#categoryGrid:not(.hidden)',{timeout:3000});
 await page.locator('.category-card[data-category="birthday"] .v14-create').click();await page.waitForFunction(()=>document.querySelector('#type')?.value==='birthday-aurora-paper',null,{timeout:5000});await wait(350);
 if(!(await page.locator('#dateField').evaluate(n=>n.classList.contains('v13-group-hidden')||n.classList.contains('hidden'))))failures.push('Birthday date field should be hidden');
 await fill('name1','QA DILNOZA');await fill('headline','QA birthday intro');await fill('letter','QA birthday letter');await fill('finalQuestion','QA final wish');await wait(200);
 if((await page.locator('#v13-completion-text').textContent())?.trim()!=='100%')failures.push('Birthday essentials do not reach 100% without sender');
 const birthdaySenderBadge=await page.locator('#name2').locator('xpath=ancestor::*[contains(@class,"field")][1]').locator('label').first().textContent();if(!birthdaySenderBadge.includes('IXTIYORIY'))failures.push('Birthday sender should be optional');
 // Proposal: six real essentials, sender/date not required.
 await page.selectOption('#type','proposal-pearl-promise');await page.dispatchEvent('#type','change');await wait(250);for(const [id,v] of [['name1','QA NAME'],['mistake','QA reason 1'],['repair','QA reason 2'],['venue','QA reason 3'],['letter','QA promise'],['finalQuestion','QA question?']])await fill(id,v);await wait(200);
 if((await page.locator('#v13-completion-text').textContent())?.trim()!=='100%')failures.push('Proposal essentials do not reach 100% without sender');if(!(await page.locator('#dateField').evaluate(n=>n.classList.contains('v13-group-hidden')||n.classList.contains('hidden'))))failures.push('Proposal date field should be hidden');
 // Wedding must still require both people + real date/venue.
 await page.selectOption('#type','wedding-silk-heritage');await page.dispatchEvent('#type','change');await wait(250);for(const [id,v] of [['name1','QA MALIKA'],['name2','QA AZIZ'],['date','2026-12-12'],['eventClock','18:30'],['venue','QA VENUE'],['letter','QA invitation']])await fill(id,v);await wait(200);if((await page.locator('#v13-completion-text').textContent())?.trim()!=='100%')failures.push('Wedding essentials do not reach 100%');if(await page.locator('#dateField').evaluate(n=>n.classList.contains('v13-group-hidden')||n.classList.contains('hidden')))failures.push('Wedding date field should be visible');
 const progressNow=await page.locator('.v13-progress').getAttribute('aria-valuenow');if(progressNow!=='100')failures.push('Accessible progressbar not synchronized: '+progressNow);
 await page.screenshot({path:path.join(folder,'v14-competitor-audit.png'),fullPage:false});
}catch(e){failures.push('Test exception: '+e.message)}
if(errors.length)failures.push('Browser exceptions: '+errors.join(' | '));const result={passed:failures.length===0,failures};await fs.writeFile(path.join(folder,'v14-competitor-audit-summary.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();if(failures.length)process.exitCode=1;
