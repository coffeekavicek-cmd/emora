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
 await page.waitForSelector('.v12-silk-video',{timeout:6000});
 const media=await page.evaluate(()=>{const v=document.querySelector('.v12-silk-video-player'),wrap=document.querySelector('.v12-silk-video');return {exists:!!v,src:v?.getAttribute('src')||'',controls:!!v?.controls,autoplay:!!v?.autoplay,playsInline:!!v?.playsInline,wrapVisible:wrap?getComputedStyle(wrap).display!=='none':false,sw:document.documentElement.scrollWidth,vw:innerWidth}});
 if(!media.exists)failures.push('Personal wedding film not rendered');if(!media.src.includes('example.invalid/wedding.mp4'))failures.push('Wedding film src roundtrip failed: '+media.src);if(!media.controls)failures.push('Wedding film controls missing');if(media.autoplay)failures.push('Wedding film must not autoplay');if(!media.playsInline)failures.push('Wedding film playsInline missing');if(!media.wrapVisible)failures.push('Wedding film wrapper hidden');if(media.sw>392)failures.push('Wedding film horizontal overflow '+media.sw);
 await page.locator('#openInvite').click();await page.waitForTimeout(1600);await page.screenshot({path:path.join(folder,'silk-mobile-personal-film.png'),fullPage:false});
}catch(e){failures.push('Test exception: '+e.message)}
if(errors.length)failures.push('Browser exceptions: '+errors.join(' | '));const result={passed:failures.length===0,failures};await fs.writeFile(path.join(folder,'silk-media-summary.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();if(failures.length)process.exitCode=1;
