import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const folder=path.resolve('v5-live/qa-v10-results');await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const failures=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
const expected={love:'Rose Theatre',wedding:'Silk Heritage',birthday:'Aurora Paper',apology:'Quiet Room',proposal:'Pearl Promise'};
try{
 const r=await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:45000});if(r.status()!==200)failures.push('Home HTTP '+r.status());
 await page.waitForFunction(()=>document.documentElement.dataset.emoraCatalog==='five-flagships',null,{timeout:12000});await page.waitForTimeout(250);
 const body=await page.locator('body').innerText();if(!/5 flagship/i.test(body))failures.push('Five-flagship positioning copy missing');if(/15 shablonni ko‘rish/i.test(body))failures.push('Old 15-template CTA still visible');
 const chips=await page.locator('.v12-proof-strip span').allTextContents();for(const copy of ['Preview bepul','Preview uchun akkaunt shart emas','Recipient login qilmaydi','Mobile-first'])if(!chips.includes(copy))failures.push('Missing proof chip: '+copy);
 const badges=await page.locator('.category-count').allTextContents();if(badges.length!==5||badges.some(x=>x.trim()!=='1 FLAGSHIP'))failures.push('Category badges are not five curated flagships: '+JSON.stringify(badges));
 for(const [group,name] of Object.entries(expected)){
  await page.locator('.category-card[data-category="'+group+'"]').click();await page.waitForTimeout(220);
  const cards=page.locator('#templateCards .card');const count=await cards.count();if(count!==1)failures.push(group+' shows '+count+' cards instead of 1');
  if(count){const got=(await cards.first().locator('h3').textContent())?.trim();if(got!==name)failures.push(group+' flagship '+got+' != '+name)}
  const options=await page.locator('#type option').allTextContents();if(options.length!==1)failures.push(group+' Creator Studio has '+options.length+' visible template options instead of 1');
  await page.locator('#changeCategory').click();await page.waitForTimeout(120);
 }
 await page.screenshot({path:path.join(folder,'v12-curated-home.png'),fullPage:true});
}catch(e){failures.push('Test exception: '+e.message)}
if(errors.length)failures.push('Browser exceptions: '+errors.join(' | '));
const result={passed:failures.length===0,failures};await fs.writeFile(path.join(folder,'v12-product-polish-summary.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();if(failures.length)process.exitCode=1;
