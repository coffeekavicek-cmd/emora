import {chromium} from 'playwright';
import fs from 'node:fs/promises';import path from 'node:path';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const outDir=path.resolve('v5-live/qa-v10-results');await fs.mkdir(outDir,{recursive:true});
const cases=[{name:'iPhone-uz',w:390,h:844,lang:'uz'},{name:'small-ru',w:360,h:740,lang:'ru'},{name:'desktop-en',w:1440,h:900,lang:'en'}];
const results=[];
for(const cfg of cases){
 const page=await browser.newPage({viewport:{width:cfg.w,height:cfg.h},isMobile:cfg.w<700,hasTouch:cfg.w<700});const errors=[],failures=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  const res=await page.goto(base+'/templates/v24-apology-secret.html?lang='+cfg.lang,{waitUntil:'domcontentloaded',timeout:45000});if(res.status()!==200)failures.push('Route HTTP '+res.status());
  await page.waitForFunction(()=>window.__EMORA_APOLOGY_V24__?.version===24);
  if(await page.evaluate(()=>window.__EMORA_APOLOGY_V24__.lang)!==cfg.lang)failures.push('Language not selected');
  await page.evaluate(()=>{window.__emoraOpenUrl='';window.open=(u)=>{window.__emoraOpenUrl=u;return {closed:false}};window.postMessage({type:'emora:moment-preview',config:{recipient:'Jasmina',sender:'Aziz',secretHint:'SECRET QA RIDDLE',photos:['/assets/apology-quiet.png'],video:'',letter:'QA UZ private letter',letterRu:'QA RU private letter',letterEn:'QA EN private letter'}},location.origin)});
  await page.waitForFunction(()=>window.__EMORA_APOLOGY_V24__?.recipient==='Jasmina');
  if(await page.locator('#secret .sub').textContent()!=='SECRET QA RIDDLE')failures.push('Secret riddle missing');
  await page.locator('#secretAnswer').fill('not-your-name');
  await page.locator('#secretForm button').click();
  if(await page.evaluate(()=>window.__EMORA_APOLOGY_V24__.active)!=='secret')failures.push('Wrong name unlocked');
  await page.locator('#secretAnswer').fill('  JASMINA  ');
  await page.locator('#secretForm button').click();
  await page.waitForFunction(()=>window.__EMORA_APOLOGY_V24__?.active==='question');
  await page.locator('#noBtn').click({force:true});
  if(await page.evaluate(()=>window.__EMORA_APOLOGY_V24__.teases)<1)failures.push('No button not playful');
  if(await page.evaluate(()=>window.__EMORA_APOLOGY_V24__.active)!=='question')failures.push('No button bypassed letter');
  await page.locator('#yesBtn').click();
  await page.waitForFunction(()=>window.__EMORA_APOLOGY_V24__?.active==='letter');
  await page.locator('#envelopeBtn').click();
  if(!(await page.locator('#letterWrap').getAttribute('class')).includes('opened'))failures.push('Envelope did not open');
  const letter=await page.locator('#letterBody').textContent();
  if(!letter.includes('QA '+cfg.lang.toUpperCase()+' private letter'))failures.push('Localized custom letter absent');
  if(await page.locator('#memories img').count()!==1)failures.push('Creator photo missing');
  await page.locator('#letterContinue').click();
  await page.waitForFunction(()=>window.__EMORA_APOLOGY_V24__?.active==='meeting');
  await page.locator('[data-choice=coffee]').click();
  await page.locator('#meetDate').fill(await page.locator('#meetDate').getAttribute('min'));
  await page.locator('#meetTime').fill('19:30');
  await page.locator('#sendMeeting').click();
  const share=await page.evaluate(()=>window.__emoraOpenUrl);
  if(!share.startsWith('https://t.me/share/url?'))failures.push('No Telegram opt-in share composer');
  const decode=new URL(share||'https://invalid.example/');
  const msg=decode.searchParams.get('text')||'';
  if(!msg.includes('19:30')||!/coffee|kof|коф/i.test(msg))failures.push('Shared meeting text missing time/choice');
  const dim=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,iw:innerWidth}));
  if(dim.sw>dim.iw+4)failures.push('Horizontal scroll on '+cfg.w+'px '+JSON.stringify(dim));
  await page.screenshot({path:path.join(outDir,'v24-apology-'+cfg.name+'.png'),fullPage:false});
  await page.locator('#replay').count(); // Exit is a separate user-controlled path; test below.
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('#secretAnswer').fill('Jasmina');
  await page.locator('#secretForm button').click(); await page.locator('#declineBtn').click();
  await page.waitForFunction(()=>window.__EMORA_APOLOGY_V24__?.active==='exit');
 }catch(e){failures.push('Browser exception: '+e.message)}
 if(errors.length)failures.push('Page exceptions: '+errors.join(' | '));
 results.push({viewport:cfg.w+'x'+cfg.h,lang:cfg.lang,passed:!failures.length,failures});
 await page.close();
}
await browser.close();
const all={passed:results.every(r=>r.passed),results};console.log(JSON.stringify(all,null,2));await fs.writeFile(path.join(outDir,'v24-apology-summary.json'),JSON.stringify(all,null,2));if(!all.passed)process.exitCode=1;
