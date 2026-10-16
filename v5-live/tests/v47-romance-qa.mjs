import {chromium} from 'playwright';
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
const errors=[];const audit=[];
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const assert=(condition,what)=>{if(!condition)throw new Error(what)};
async function pageFor(name,route,viewport={width:390,height:844}){
 const page=await browser.newPage({viewport,isMobile:viewport.width<700,hasTouch:viewport.width<700});
 const exceptions=[];page.on('pageerror',e=>exceptions.push(e.message));
 const response=await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:35000});
 assert(response?.status()===200,name+' HTTP '+response?.status());
 return {page,exceptions};
}
async function check(name,fn){try{await fn();audit.push({name,passed:true});console.log('PASS',name)}catch(e){errors.push(name+': '+e.message);audit.push({name,passed:false,error:e.message});console.error('FAIL',name,e.message)}}
await check('4 thematic covers load and replace every stock portrait on landing',async()=>{
 const {page,exceptions}=await pageFor('catalog','/');
 await page.waitForSelector('#categoryGrid .category-card');
 for(const key of ['birthday','apology','love','proposal']){
  const img=page.locator('#categoryGrid .category-card[data-category='+key+'] img');
  assert(await img.count()===1,key+' card missing');
  const src=await img.getAttribute('src');
  assert(src==='/assets/cover-'+key+'-v47.svg',key+' showing '+src);
  const res=await page.request.get(base+src);assert(res.status()===200,key+' cover missing');
  const svg=await res.text();assert(svg.includes('<svg')&&!svg.includes('<image'),key+' not vector illustrated');
 }
 assert(await page.locator('#romancePledge').count()===1,'romance manifesto missing');
 assert(!exceptions.length,exceptions.join(';'));await page.close();
});
await check('Birthday birthday-date → 5 candles → dessert → photo/video/letter → name portrait',async()=>{
 const {page,exceptions}=await pageFor('birthday','/templates/v19-birthday-cake.html?lang=ru',{width:360,height:740});
 await page.waitForFunction(()=>window.__EMORA_BIRTHDAY_V19__?.version===19);
 await page.locator('#birthday').fill('2005-08-15');await page.locator('#dateForm button').click();
 console.log('CANDLE_LAYOUT',JSON.stringify(await page.evaluate(()=>({viewport:[innerWidth,innerHeight],parent:(()=>{const r=document.querySelector('#candles').getBoundingClientRect();return [r.x,r.y,r.width,r.height]})(),candles:[...document.querySelectorAll('#candles button')].map((el,i)=>{const r=el.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2,at=document.elementFromPoint(x,y);return {i,rect:[r.x,r.y,r.width,r.height],hit:at?.outerHTML?.slice(0,130),display:getComputedStyle(el).display,position:getComputedStyle(el).position}})}))));
 for(let i=0;i<5;i++)await page.locator('#candles button').nth(i).click();
 assert(await page.evaluate(()=>window.__EMORA_BIRTHDAY_V19__.candlesOut)===5,'candles not extinguished');
 await page.locator('#cakeNext').click();assert(await page.evaluate(()=>window.__EMORA_BIRTHDAY_V19__.active)==='dessert','dessert scene not entered');
 await page.locator('[data-dessert=you]').click();assert((await page.locator('#dessertResult').textContent()).length>12,'dessert reveal missing');
 await page.locator('#dessertNext').click();assert(await page.evaluate(()=>window.__EMORA_BIRTHDAY_V19__.active)==='photos','photos blocked');
 await page.locator('[data-next=film]').click();await page.locator('[data-next=letter]').click();await page.locator('#openLetter').click();
 await page.locator('#letterNext:visible').waitFor({timeout:2500});await page.locator('#letterNext').click();
 await page.waitForFunction(()=>window.__EMORA_MOSAIC_V28__?.ready===true,null,{timeout:18000});
 await page.locator('#heartSlider').fill('50');await page.locator('#heartSlider').fill('100');
 assert(await page.evaluate(()=>window.__EMORA_MOSAIC_V28__.stage)==='portrait','portrait morph not completed');
 const g=await page.evaluate(()=>({iw:innerWidth,sw:document.documentElement.scrollWidth}));
 assert(g.sw<=g.iw+4,'birthday mobile horizontal overflow');
 assert(!exceptions.length,exceptions.join(';'));await page.close();
});
await check('Apology dessert secret → upset answer → sincere letter',async()=>{
 const {page,exceptions}=await pageFor('apology','/templates/v24-apology-secret.html?lang=ru');
 await page.waitForFunction(()=>window.__EMORA_APOLOGY_V24__?.version===24);
 assert((await page.locator('#secretTitle').textContent()).includes('десерт'),'user dessert question missing');
 await page.locator('#secretAnswer').fill('Jasmina');await page.locator('#secretForm button').click();
 assert(await page.evaluate(()=>window.__EMORA_APOLOGY_V24__.active)==='question','question missing');
 await page.locator('#yesBtn').focus();await page.locator('#yesBtn').press('Enter');
 assert(await page.evaluate(()=>window.__EMORA_APOLOGY_V24__.active)==='letter','honest yes answer is trapped');
 assert((await page.locator('#letterBody').textContent()).includes('всё ещё обижена'),'upset answer not respected');
 await page.locator('#envelopeBtn').click();assert(await page.locator('#letterWrap').evaluate(el=>el.classList.contains('opened')),'sealed letter cannot open');
 assert(!exceptions.length,exceptions.join(';'));await page.close();
});
await check('Love confession supports personal story and glyph portrait',async()=>{
 const {page,exceptions}=await pageFor('love','/templates/v26-love-confession.html?lang=ru');
 await page.waitForFunction(()=>window.__EMORA_LOVE_V26__!==undefined,null,{timeout:15000});
 await page.locator('[data-answer=friend]').click();
 await page.locator('#galleryNext').click();await page.locator('#filmNext').click();await page.locator('#envelopeBtn').click();await page.locator('#letterNext').click();
 await page.waitForFunction(()=>window.__EMORA_MOSAIC_V28__?.ready===true,null,{timeout:18000});
 await page.locator('#heartSlider').fill('100');
 assert(await page.evaluate(()=>window.__EMORA_MOSAIC_V28__.stage)==='portrait','love portrait final missing');
 assert(!exceptions.length,exceptions.join(';'));await page.close();
});
await check('Proposal has real ring reveal scene and uses theme music',async()=>{
 const {page,exceptions}=await pageFor('proposal','/templates/v10-proposal-pearl.html?lang=ru');
 await page.waitForFunction(()=>window.__EMORA_PEARL_PROMISE__?.flagship===true,null,{timeout:18000});
 assert(await page.locator('.pp-open-ring').count()===1,'proposal ring opening action missing');
 assert((await page.request.get(base+'/assets/theme-proposal-v42.mp3')).status()===200,'proposal soundtrack missing');
 assert(!exceptions.length,exceptions.join(';'));await page.close();
});
await browser.close();
console.log(JSON.stringify({passed:errors.length===0,audit,errors},null,2));
if(errors.length)process.exitCode=1;
