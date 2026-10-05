import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const folder=path.resolve('v5-live/qa-v10-results');await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const failures=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
const expected={love:'Rose Theatre',wedding:'Silk Heritage',birthday:'Aurora Paper',apology:'Quiet Room',proposal:'Pearl Promise'};
const expectedCopy={love:'Private theatre',wedding:'Premium wedding experience',birthday:'Gift ritual',apology:'Bosimsiz apology ritual',proposal:'Jewelry-box proposal'};
const visible=id=>page.locator('#'+id).evaluate(n=>{const f=n.closest('.field');return !!f&&getComputedStyle(f).display!=='none'});
async function choose(slug){await page.selectOption('#type',slug);await page.dispatchEvent('#type','change');await page.waitForTimeout(260)}
try{
 const r=await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:45000});if(r.status()!==200)failures.push('Home HTTP '+r.status());
 await page.waitForFunction(()=>document.documentElement.dataset.emoraCatalog==='five-flagships',null,{timeout:12000});await page.waitForTimeout(350);
 const body=await page.locator('body').innerText();if(!/5 flagship/i.test(body))failures.push('Five-flagship positioning copy missing');if(/15 shablonni ko‘rish/i.test(body))failures.push('Old 15-template CTA still visible');if(/Supabase/i.test(body))failures.push('Backend implementation name leaked into customer copy');if(/Click\/Payme keyin/i.test(body))failures.push('Work-in-progress payment copy still visible');if(await page.locator('.competitor-note').count())failures.push('Internal competitor note is still visible');
 const typeLabel=(await page.locator('#type').locator('xpath=ancestor::*[contains(@class,"field")][1]/label[1]').textContent())?.trim();if(typeLabel!=='EXPERIENCE')failures.push('Creator primary selector label is not EXPERIENCE: '+typeLabel);
 for(const id of ['v12-translations','v12-media']){const d=page.locator('#'+id);if(await d.count()!==1)failures.push('Missing progressive editor section '+id);else if(await d.evaluate(n=>n.open))failures.push(id+' should be collapsed on first load')}
 if(await page.locator('#v12-fast-path').count()!==1)failures.push('Fast creator guide missing');if(await page.locator('#v12-privacy-cue').count()!==1)failures.push('Privacy/recipient cue missing');
 const chips=await page.locator('.v12-proof-strip span').allTextContents();for(const copy of ['Preview bepul','Akkauntsiz yaratishni boshlash','Recipient login qilmaydi','Mobile-first','Shaxsiy link + QR'])if(!chips.includes(copy))failures.push('Missing proof chip: '+copy);
 const badges=await page.locator('.category-count').allTextContents();if(badges.length!==5||badges.some(x=>x.trim()!=='1 FLAGSHIP'))failures.push('Category badges are not five curated flagships: '+JSON.stringify(badges));
 for(const [group,name] of Object.entries(expected)){
  const card=page.locator('.category-card[data-category="'+group+'"]');const bg=await card.locator('.category-visual').evaluate(n=>getComputedStyle(n).backgroundImage);if(/https?:/i.test(bg))failures.push(group+' category artwork still depends on external URL: '+bg);if(!/\/assets\//.test(bg))failures.push(group+' category artwork is not local asset: '+bg);
  const categoryCopy=(await card.locator('.category-body p').textContent())||'';if(!categoryCopy.includes(expectedCopy[group]))failures.push(group+' flagship copy not updated: '+categoryCopy);
  await card.click();await page.waitForTimeout(220);
  const cards=page.locator('#templateCards .card');const count=await cards.count();if(count!==1)failures.push(group+' shows '+count+' cards instead of 1');
  if(count){const got=(await cards.first().locator('h3').textContent())?.trim();if(got!==name)failures.push(group+' flagship '+got+' != '+name)}
  const options=await page.locator('#type option').allTextContents();if(options.length!==1)failures.push(group+' Creator Studio has '+options.length+' visible template options instead of 1');
  await page.locator('#changeCategory').click();await page.waitForTimeout(120);
 }
 await choose('love-rose-theatre');for(const id of ['photo1','photo2','photo3','caption1','videoUrl'])if(!await visible(id))failures.push('Rose hides required '+id);
 await choose('birthday-aurora-paper');for(const id of ['photo1','photo2','photo3','videoUrl'])if(!await visible(id))failures.push('Aurora hides required '+id);
 await choose('apology-quiet-room');if(!await visible('mistake')||!await visible('repair')||!await visible('photo1'))failures.push('Quiet Room hides required apology fields');if(await visible('photo2')||await visible('photo3'))failures.push('Quiet Room exposes unnecessary extra photos');
 await choose('proposal-pearl-promise');for(const id of ['mistake','repair','venue','photo1','photo2','photo3'])if(!await visible(id))failures.push('Pearl hides required '+id);if(await visible('memoryTitle'))failures.push('Pearl exposes unused memory title in fast path');
 await choose('wedding-silk-heritage');for(const id of ['venue','venueMap','programInput','date','photo1','videoUrl'])if(!await visible(id))failures.push('Silk hides required '+id);if(await visible('mistake')||await visible('repair'))failures.push('Silk exposes apology controls');
 await page.screenshot({path:path.join(folder,'v12-curated-home.png'),fullPage:true});
}catch(e){failures.push('Test exception: '+e.message)}
if(errors.length)failures.push('Browser exceptions: '+errors.join(' | '));
const result={passed:failures.length===0,failures};await fs.writeFile(path.join(folder,'v12-product-polish-summary.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();if(failures.length)process.exitCode=1;