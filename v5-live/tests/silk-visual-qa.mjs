import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const output=path.resolve('v5-live/qa-silk-artifacts');
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
for(const device of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844},{name:'small-mobile',width:360,height:740}]){
 const page=await browser.newPage({viewport:{width:device.width,height:device.height},deviceScaleFactor:1,hasTouch:device.name!=='desktop',isMobile:device.name!=='desktop'});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto(base+'/templates/wedding-silk.html',{waitUntil:'networkidle',timeout:45000});
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(250);
 const intro=await page.evaluate(()=>{
  const photo=document.querySelector('.silk-intro-photo'),copy=document.querySelector('.silk-intro-copy'),
        visual=document.querySelector('.silk-intro-photo-frame'),cta=document.querySelector('#openInvite'),
        title=document.querySelector('.silk-intro-heading');
  const r=x=>{const b=x.getBoundingClientRect();return {x:Math.round(b.x),y:Math.round(b.y),right:Math.round(b.right),bottom:Math.round(b.bottom),width:Math.round(b.width),height:Math.round(b.height)}};
  return {photoLoaded:photo.complete&&photo.naturalWidth>0,photoWidth:photo.naturalWidth,photoHeight:photo.naturalHeight,
   photoRect:r(visual),copyRect:r(copy),ctaRect:r(cta),titleRect:r(title),mockCurtains:document.querySelectorAll('.curtain').length,
   webglCanvas:document.querySelectorAll('#silkCanvas').length,bodyScrollWidth:document.body.scrollWidth,screenWidth:innerWidth}
 });
 await page.screenshot({path:path.join(output,device.name+'-opening.png'),fullPage:false});
 await page.locator('#openInvite').click();
 await page.waitForTimeout(2300);
 const opened=await page.evaluate(()=>({introHidden:getComputedStyle(document.querySelector('#silkIntro')).visibility==='hidden',
   heroVisible:!!document.querySelector('#coupleNames'),scrollWidth:document.documentElement.scrollWidth,screenWidth:innerWidth}));
 await page.screenshot({path:path.join(output,device.name+'-inside.png'),fullPage:false});
 const failures=[];
 if(response.status()!==200)failures.push('Main page not HTTP 200');
 if(!intro.photoLoaded)failures.push('Original cinematic image did not load');
 if(intro.mockCurtains!==0||intro.webglCanvas!==0)failures.push('Old fake curtains / untextured 3D still present');
 if(intro.ctaRect.x<0||intro.ctaRect.right>device.width+2||intro.ctaRect.bottom>device.height+2)failures.push('Opening button outside viewport');
 if(intro.titleRect.x<-4||intro.titleRect.right>device.width+4)failures.push('Opening title horizontal overflow');
 if(intro.bodyScrollWidth>device.width+4)failures.push('Opening horizontal overflow');
 if(!opened.introHidden)failures.push('Opening did not dismiss after click');
 if(opened.scrollWidth>device.width+4)failures.push('Interior horizontal overflow');
 if(errors.length)failures.push('Page JS exceptions: '+errors.join('; '));
 const result={device:device.name,passed:failures.length===0,failures,intro,opened};
 results.push(result);
 await fs.writeFile(path.join(output,device.name+'-report.json'),JSON.stringify(result,null,2));
 await page.close();
}
await browser.close();
await fs.writeFile(path.join(output,'summary.json'),JSON.stringify(results,null,2));
console.log(JSON.stringify(results.map(({device,passed,failures,intro})=>({device,passed,failures,imageLoaded:intro.photoLoaded,cta:intro.ctaRect,photo:intro.photoRect})),null,2));
if(results.some(r=>!r.passed))process.exitCode=1;
