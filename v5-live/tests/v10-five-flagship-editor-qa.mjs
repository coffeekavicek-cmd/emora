import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const folder=path.resolve('v5-live/qa-v10-results');await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const failures=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
const label=async id=>page.locator('#'+id).evaluate(el=>el.closest('.field')?.querySelector(':scope > label')?.textContent||'');
async function choose(slug){await page.selectOption('#type',slug);await page.dispatchEvent('#type','change');await page.waitForTimeout(180)}
async function expectLabel(id,expected,context){const got=(await label(id))?.trim();if(got!==expected)failures.push(context+' '+id+' label: '+got+' != '+expected)}
try{
 const r=await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:45000});if(r.status()!==200)failures.push('Home HTTP '+r.status());await page.waitForSelector('#type');await page.waitForSelector('#previewLabel');await page.waitForTimeout(500);
 await choose('love-rose-theatre');await expectLabel('memoryTitle','SPEKTAKL / HIKOYA NOMI','Rose');await expectLabel('caption1','ACT I · BIRINCHI KADR','Rose');await expectLabel('videoUrl','PRIVATE SCREENING · VIDEO','Rose');await expectLabel('letter','LIVE CONFESSION · UZ','Rose');await expectLabel('finalQuestion','ENCORE · FINAL SAVOL','Rose');
 await choose('birthday-aurora-paper');await expectLabel('memoryTitle','MEMORY CONTACT SHEET · NOMI','Aurora');await expectLabel('caption1','01-SURAT · FLIRT','Aurora');await expectLabel('caption2','02-SURAT · FLIRT','Aurora');await expectLabel('caption3','03-SURAT · FLIRT','Aurora');await expectLabel('videoUrl','PRIVATE BIRTHDAY FILM · VIDEO','Aurora');await expectLabel('letter','BIRTHDAY LETTER · UZ','Aurora');await expectLabel('finalQuestion','FINAL WISH · OXIRGI SATR','Aurora');
 await choose('apology-quiet-room');await expectLabel('mistake','MEN QILGAN XATO · SAMIMIY','Quiet');await expectLabel('repair','ENDI NIMANI O‘ZGARTIRAMAN','Quiet');await expectLabel('caption1','01-SURAT · FLIRT','Quiet');await expectLabel('videoUrl','IXTIYORIY VIDEO · AUTOPLAY YO‘Q','Quiet');await expectLabel('finalQuestion','OXIRGI KOMPLIMENT / HAZIL','Quiet');
 await choose('proposal-pearl-promise');await expectLabel('mistake','NEGA SEN? · 1-SABAB','Pearl');await expectLabel('repair','NEGA SEN? · 2-SABAB','Pearl');await expectLabel('venue','NEGA SEN? · 3-SABAB','Pearl');await expectLabel('letter','MENING VA’DAM · UZ','Pearl');await expectLabel('finalQuestion','ENG MUHIM SAVOL','Pearl');
 await choose('wedding-silk-heritage');await expectLabel('memoryTitle','LOVE STORY / BO‘LIM NOMI','Silk');await expectLabel('caption1','01-XOTIRA','Silk');await expectLabel('videoUrl','LOVE STORY VIDEO · IXTIYORIY','Silk');await expectLabel('letter','MEHMON UCHUN SHAXSIY TAKLIF · UZ','Silk');await expectLabel('finalQuestion','OILA DUOSI / YAKUNIY SATR','Silk');
 const pearlHidden=await page.locator('#proposalPearlExtra').evaluate(n=>n.classList.contains('hidden'));if(!pearlHidden)failures.push('Pearl-only editor note stayed visible after switching to Silk');
 await page.screenshot({path:path.join(folder,'five-flagship-editor.png'),fullPage:false});
}catch(e){failures.push('Test exception: '+e.message)}
if(errors.length)failures.push('Browser exceptions: '+errors.join(' | '));const result={passed:failures.length===0,failures};await fs.writeFile(path.join(folder,'five-flagship-editor-summary.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();if(failures.length)process.exitCode=1;
