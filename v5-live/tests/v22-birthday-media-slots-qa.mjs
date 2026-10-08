import {chromium} from 'playwright';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const cases=[{name:'mobile',w:390,h:844},{name:'desktop',w:1440,h:900}];
const report=[];
for(const c of cases){
 const page=await browser.newPage({viewport:{width:c.w,height:c.h},isMobile:c.w<600,hasTouch:c.w<600});
 const failures=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  const resp=await page.goto(base+'/',{waitUntil:'domcontentloaded',timeout:45000});
  if(resp.status()!==200)failures.push('Root HTTP '+resp.status());
  await page.selectOption('#type','birthday-aurora-paper');
  await page.waitForFunction(()=>document.querySelector('#studioIframe')?.contentWindow?.__EMORA_BIRTHDAY_V19__?.version===19,null,{timeout:10000});
  await page.locator('#v15-media summary').click();
  await page.locator('#photo1').fill('');
  await page.locator('#photo2').fill(base+'/assets/love-rose.png');
  await page.locator('#photo3').fill(base+'/assets/birthday-aurora.png');
  await page.locator('#caption1').fill('Caption FIRST belongs to empty slot');
  await page.locator('#caption2').fill('Caption SECOND belongs to photo TWO');
  await page.locator('#caption3').fill('Caption THIRD belongs to photo THREE');
  await page.waitForTimeout(250);
  const frame=page.frameLocator('#studioIframe');
  const imgs=await frame.locator('#gallery .photo-card img').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('src')));
  const captions=await frame.locator('#gallery .photo-card p').allTextContents();
  if(imgs.length!==3)failures.push('Expected three stable portrait slots');
  if(!imgs[0]?.includes('/assets/birthday-aurora.png'))failures.push('Slot 1 placeholder is not preserved: '+imgs[0]);
  if(!imgs[1]?.includes('/assets/love-rose.png'))failures.push('Slot 2 artwork shifted/missing: '+imgs[1]);
  if(!imgs[2]?.includes('/assets/birthday-aurora.png'))failures.push('Slot 3 artwork shifted: '+imgs[2]);
  if(captions.join('|')!=='Caption FIRST belongs to empty slot|Caption SECOND belongs to photo TWO|Caption THIRD belongs to photo THREE')failures.push('Caption order changed: '+captions.join('|'));
  const sw=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
  if(sw.scroll>sw.width+4)failures.push('Horizontal overflow: '+JSON.stringify(sw));
 }catch(e){failures.push(e.message)}
 if(errors.length)failures.push('JS errors: '+errors.join('|'));
 report.push({name:c.name,passed:failures.length===0,failures});
 await page.close();
}
await browser.close();
const passed=report.every(r=>r.passed);
console.log(JSON.stringify({passed,report},null,2));
if(!passed)process.exitCode=1;
