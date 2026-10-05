import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const folder=path.resolve('v5-live/qa-v10-results');await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const failures=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
const expected={love:{name:'Rose Theatre',slug:'love-rose-theatre'},wedding:{name:'Silk Heritage',slug:'wedding-silk-heritage'},birthday:{name:'Aurora Paper',slug:'birthday-aurora-paper'},apology:{name:'Quiet Room',slug:'apology-quiet-room'},proposal:{name:'Pearl Promise',slug:'proposal-pearl-promise'}};
const expectedCopy={love:'Private theatre',wedding:'Premium wedding experience',birthday:'Gift ritual',apology:'Bosimsiz apology ritual',proposal:'Jewelry-box proposal'};
const visible=id=>page.locator('#'+id).evaluate(n=>{const f=n.closest('.field');return !!f&&getComputedStyle(f).display!=='none'});
async function openCategory(group){await page.locator('.category-card[data-category="'+group+'"]').click();await page.waitForTimeout(260)}
async function back(){await page.locator('#changeCategory').click();await page.waitForTimeout(160)}
try{
 const r=await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:45000});if(r.status()!==200)failures.push('Home HTTP '+r.status());
 await page.waitForFunction(()=>document.documentElement.dataset.emoraCatalog==='five-flagships',null,{timeout:12000});await page.waitForTimeout(350);
 const body=await page.locator('body').innerText();if(!/5 flagship/i.test(body))failures.push('Five-flagship positioning copy missing');if(/15 shablonni ko‘rish/i.test(body))failures.push('Old 15-template CTA still visible');if(/Supabase/i.test(body))failures.push('Backend implementation name leaked into customer copy');if(/Click\/Payme keyin/i.test(body))failures.push('Work-in-progress payment copy still visible');if(await page.locator('.competitor-note').count())failures.push('Internal competitor note is still visible');
 const typeLabel=(await page.locator('#type').locator('xpath=ancestor::*[contains(@class,"field")][1]/label[1]').textContent())?.trim();if(typeLabel!=='EXPERIENCE')failures.push('Creator primary selector label is not EXPERIENCE: '+typeLabel);
 for(const id of ['v12-translations','v12-media']){const d=page.locator('#'+id);if(await d.count()!==1)failures.push('Missing progressive editor section '+id);else if(await d.evaluate(n=>n.open))failures.push(id+' should be collapsed on first load')}
 if(await page.locator('#v12-fast-path').count()!==1)failures.push('Fast creator guide missing');if(await page.locator('#v12-privacy-cue').count()!==1)failures.push('Privacy/recipient cue missing');
 const chips=await page.locator('.v12-proof-strip span').allTextContents();for(const copy of ['Preview bepul','Akkauntsiz yaratishni boshlash','Recipient login qilmaydi','Mobile-first','Shaxsiy link + QR'])if(!chips.includes(copy))failures.push('Missing proof chip: '+copy);
 const badges=await page.locator('.category-count').allTextContents();if(badges.length!==5||badges.some(x=>x.trim()!=='1 FLAGSHIP'))failures.push('Category badges are not five curated flagships: '+JSON.stringify(badges));
 for(const [group,info] of Object.entries(expected)){
  const card=page.locator('.category-card[data-category="'+group+'"]');const art=await card.locator('.category-visual').evaluate(n=>({bg:getComputedStyle(n).backgroundImage,local:n.dataset.localArt}));if(art.local!=='true')failures.push(group+' category art was not replaced with local artwork');if(!/\/assets\//.test(art.bg))failures.push(group+' category artwork is not local asset: '+art.bg);if(/wikimedia|unsplash|commons/i.test(art.bg))failures.push(group+' category artwork still references external source: '+art.bg);
  const categoryCopy=(await card.locator('.category-body p').textContent())||'';if(!categoryCopy.includes(expectedCopy[group]))failures.push(group+' flagship copy not updated: '+categoryCopy);
  await openCategory(group);
  const cards=page.locator('#templateCards .card');const count=await cards.count();if(count!==1)failures.push(group+' shows '+count+' cards instead of 1');if(count){const got=(await cards.first().locator('h3').textContent())?.trim();if(got!==info.name)failures.push(group+' flagship '+got+' != '+info.name)}
  const options=page.locator('#type option');if(await options.count()!==1)failures.push(group+' Creator Studio has '+await options.count()+' visible template options instead of 1');else{const value=await options.first().getAttribute('value');if(value!==info.slug)failures.push(group+' selected option '+value+' != '+info.slug)}
  if(group==='love'){for(const id of ['photo1','photo2','photo3','caption1','videoUrl'])if(!await visible(id))failures.push('Rose hides required '+id)}
  if(group==='birthday'){for(const id of ['photo1','photo2','photo3','videoUrl'])if(!await visible(id))failures.push('Aurora hides required '+id)}
  if(group==='apology'){if(!await visible('mistake')||!await visible('repair')||!await visible('photo1'))failures.push('Quiet Room hides required apology fields');if(await visible('photo2')||await visible('photo3'))failures.push('Quiet Room exposes unnecessary extra photos')}
  if(group==='proposal'){for(const id of ['mistake','repair','venue','photo1','photo2','photo3'])if(!await visible(id))failures.push('Pearl hides required '+id);if(await visible('memoryTitle'))failures.push('Pearl exposes unused memory title in fast path')}
  if(group==='wedding'){for(const id of ['venue','venueMap','programInput','date','photo1','videoUrl'])if(!await visible(id))failures.push('Silk hides required '+id);if(await visible('mistake')||await visible('repair'))failures.push('Silk exposes apology controls')}
  await back();
 }
 await page.screenshot({path:path.join(folder,'v12-curated-home.png'),fullPage:true});
}catch(e){failures.push('Test exception: '+e.message)}
if(errors.length)failures.push('Browser exceptions: '+errors.join(' | '));
const result={passed:failures.length===0,failures};await fs.writeFile(path.join(folder,'v12-product-polish-summary.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();if(failures.length)process.exitCode=1;