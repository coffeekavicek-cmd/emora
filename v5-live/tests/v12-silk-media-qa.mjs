import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const folder=path.resolve('v5-live/qa-v10-results');await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true});
const failures=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 const r=await page.goto(base+'/templates/wedding-silk.html?qa=media',{waitUntil:'domcontentloaded',timeout:45000});if(r.status()!==200)failures.push('HTTP '+r.status());
 await page.waitForSelector('#openInvite');
 await page.evaluate(()=>window.postMessage({type:'emora:wedding-preview',config:{bride:'QA MALIKA',groom:'QA AZIZ',invitation:'QA taklif',eventAt:'2027-06-25T18:00:00+05:00',venue:'QA VENUE',photos:['/assets/love-rose.png'],video:'https://example.invalid/wedding.mp4',music:'',program:[{time:'18:00',title:'QA CEREMONY'}]}},location.origin));
 const film=page.locator('.v12-silk-video');await film.waitFor({timeout:6000,state:'attached'});
 const before=await page.evaluate(()=>{const v=document.querySelector('.v12-silk-video-player');return {exists:!!v,src:v?.getAttribute('src')||'',controls:!!v?.controls,autoplay:!!v?.autoplay,playsInline:!!v?.playsInline}});
 if(!before.exists)failures.push('Personal wedding film not rendered');if(!before.src.includes('example.invalid/wedding.mp4'))failures.push('Wedding film src roundtrip failed: '+before.src);if(!before.controls)failures.push('Wedding film controls missing');if(before.autoplay)failures.push('Wedding film must not autoplay');if(!before.playsInline)failures.push('Wedding film playsInline missing');if(await film.isVisible())failures.push('Wedding film leaked before invitation was opened');
 await page.locator('#openInvite').click();await page.waitForTimeout(1600);if(await film.isVisible())failures.push('Wedding film appeared in opening chapter instead of Love Story');
 await page.locator('#beginStory').click();await film.waitFor({timeout:6000,state:'visible'});await page.waitForTimeout(250);
 const after=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,vw:innerWidth,active:document.querySelector('#silkExperience>.chapter.silk-stage-active')?.id||''}));if(after.active!=='story')failures.push('Love Story chapter did not become active: '+after.active);if(after.sw>392)failures.push('Wedding film horizontal overflow '+after.sw);
 await page.screenshot({path:path.join(folder,'silk-mobile-personal-film.png'),fullPage:false});
}catch(e){failures.push('Test exception: '+e.message)}
if(errors.length)failures.push('Browser exceptions: '+errors.join(' | '));const result={passed:failures.length===0,failures};await fs.writeFile(path.join(folder,'silk-media-summary.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();if(failures.length)process.exitCode=1;