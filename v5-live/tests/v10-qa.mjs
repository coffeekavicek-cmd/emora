import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const folder=path.resolve('v5-live/qa-v10-results');
await fs.mkdir(folder,{recursive:true});
const names=['love-rose','love-pearl','love-galaxy','wedding-silk','wedding-garden','wedding-naqsh','birthday-aurora','birthday-balloon','birthday-memory','apology-rain','apology-ink','apology-quiet','proposal-pearl','proposal-cinema','proposal-sky'];
const flagship=new Set(['love-rose','wedding-silk','birthday-aurora','apology-rain','proposal-pearl']);
const devices=[{name:'mobile',width:390,height:844,names},{name:'small',width:360,height:740,names:[...flagship]},{name:'desktop',width:1440,height:900,names:[...flagship]}];
const results=[];
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
try{
 for(const device of devices)for(const key of device.names){
  const page=await browser.newPage({viewport:{width:device.width,height:device.height},deviceScaleFactor:1,hasTouch:device.name!=='desktop',isMobile:device.name!=='desktop'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const item={template:key,device:device.name,viewport:device.width+'x'+device.height,passed:false,failures:[],exceptions:[]};
  try{
   const url=base+'/templates/'+(key==='wedding-silk'?'wedding-silk':'v10-'+key)+'.html?qa=1';
   const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
   if(response.status()!==200)item.failures.push('HTTP '+response.status());
   if(key!=='wedding-silk'){try{await page.waitForFunction(()=>!!window.__EMORA_V10_READY__,{timeout:20000})}catch{item.failures.push('Experience engine did not finish loading')}}
   const expectedImage=key==='wedding-silk'?'.silk-intro-photo':'.v10-hero-image';
   const expectedButton=key==='wedding-silk'?'#openInvite':'#openIntro';
   if(!(await page.locator(expectedImage).count()))item.failures.push('Intro hero image missing');
   else{
    try{await page.waitForFunction(selector=>{const img=document.querySelector(selector);return img&&img.complete&&img.naturalWidth>0},expectedImage,{timeout:20000})}catch{item.failures.push('Original artwork did not load')}
   }
   const layout=await page.evaluate(({key})=>{
    const intro=document.querySelector(key==='wedding-silk'?'#silkIntro':'#intro'),img=intro?.querySelector('img'),btn=intro?.querySelector('button#openInvite,button#openIntro'),title=intro?.querySelector('h1');
    const rect=x=>{if(!x)return null;const b=x.getBoundingClientRect();return{x:b.x,y:b.y,right:b.right,bottom:b.bottom,width:b.width,height:b.height}};
    return{imageLoaded:!!img?.naturalWidth,img:rect(img),button:rect(btn),headline:rect(title),frame:rect(intro?.querySelector('.v10-visual-frame')),frameRadius:intro?.querySelector('.v10-visual-frame')?getComputedStyle(intro.querySelector('.v10-visual-frame')).borderTopLeftRadius:null,scrollWidth:document.documentElement.scrollWidth,screenWidth:innerWidth,
      categoryCount:document.querySelectorAll('.v10-scene').length};
   },{key});
   item.layout=layout;
   if(!layout.imageLoaded)item.failures.push('Image has zero naturalWidth');
   if(layout.scrollWidth>device.width+4)item.failures.push('Horizontal overflow '+layout.scrollWidth);
   if(!layout.button||layout.button.x<0||layout.button.right>device.width+3||layout.button.bottom>device.height+3)item.failures.push('Intro action outside viewport');
   if(!layout.headline||layout.headline.x<-4||layout.headline.right>device.width+4)item.failures.push('Intro headline horizontal overflow');
   if(key!=='wedding-silk'&&layout.categoryCount<3)item.failures.push('Missing interactive story chapters');
   const immersive=new Set(['love-rose','love-galaxy','wedding-garden','birthday-balloon','apology-rain','apology-quiet','proposal-pearl','proposal-cinema','proposal-sky']);
   if(device.width<701&&immersive.has(key)&&(!layout.frame||layout.frame.width<device.width*.93||layout.frame.height<device.height*.67))item.failures.push('Unique full-bleed intro missing (appears to use generic arch)');
   await page.screenshot({path:path.join(folder,device.name+'-'+key+'-intro.png'),fullPage:false});
   const button=page.locator(expectedButton);if(await button.count()){await button.click();await page.waitForTimeout(2400);
    const isHidden=await page.evaluate(key=>{const el=document.querySelector(key==='wedding-silk'?'#silkIntro':'#intro');return el&&getComputedStyle(el).visibility==='hidden'},key);
    if(!isHidden)item.failures.push('Intro did not dismiss after clicking');
   }
   if(key!=='wedding-silk'){
    await page.evaluate(()=>window.postMessage({type:'emora:preview',config:{recipient:'DILNOZA QA',bride:'MALIKA QA',groom:'JASUR QA',intro:'QA PERSONALIZATION',letter:'Faqat QA uchun xavfsiz xat.',final:'QA FINAL QUESTION',date:'2027-06-25'}},location.origin));
    await page.waitForTimeout(130);
    const personalized=await page.locator('#coverTitle').textContent();
    if(personalized!=='QA PERSONALIZATION')item.failures.push('Live personalization failed: '+personalized);
    const introTitle=await page.locator('#introHeadline').textContent();
    if(introTitle!=='QA PERSONALIZATION')item.failures.push('Intro personalized copy failed');
   }
   const innerWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
   if(innerWidth>device.width+4)item.failures.push('Interior horizontal overflow '+innerWidth);
   if(device.name==='mobile'&&flagship.has(key))await page.screenshot({path:path.join(folder,device.name+'-'+key+'-inside.png'),fullPage:false});
  }catch(e){item.failures.push('Test exception: '+e.message)}
  item.exceptions=errors;if(errors.length)item.failures.push('Browser JS exception(s): '+errors.join('; '));
  item.passed=item.failures.length===0;
  results.push(item);
  await page.close();
 }
}finally{await browser.close()}
await fs.writeFile(path.join(folder,'summary.json'),JSON.stringify(results,null,2));
const report={tested:results.length,passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).map(x=>({template:x.template,device:x.device,failures:x.failures})),representative:results.filter(r=>r.device==='desktop').map(r=>({template:r.template,passed:r.passed}))};
console.log(JSON.stringify(report,null,2));
if(report.failed.length)process.exitCode=1;
