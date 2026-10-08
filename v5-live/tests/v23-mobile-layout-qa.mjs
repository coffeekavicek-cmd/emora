import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const base=process.env.EMORA_QA_BASE||'http://127.0.0.1:3000';
for(const width of [360,390,430,768,1440]){
 const page=await browser.newPage({viewport:{width,height:844},isMobile:width<500,hasTouch:width<500,deviceScaleFactor:1});
 await page.goto(base,{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(250);
 const data=await page.evaluate(()=>{
  const take=(sel)=>{const el=document.querySelector(sel);if(!el)return null;const s=getComputedStyle(el),r=el.getBoundingClientRect();return {display:s.display,position:s.position,gridTemplateColumns:s.gridTemplateColumns,fontSize:s.fontSize,width:Math.round(r.width),height:Math.round(r.height),left:Math.round(r.left),right:Math.round(r.right),top:Math.round(r.top),whiteSpace:s.whiteSpace,minWidth:s.minWidth,overflowWrap:s.overflowWrap}};
  return {viewport:innerWidth,docWidth:document.documentElement.scrollWidth,media640:matchMedia('(max-width:640px)').matches,media1050:matchMedia('(max-width:1050px)').matches,site:take('#siteApp'),hero:take('.hero'),heroText:take('.hero>div:first-child'),heroEyebrow:take('.hero .eyebrow'),heroHeading:take('.hero h1'),heroCopy:take('.hero .hero-copy'),heroArt:take('.hero-art'),heroNote:take('.hero .note'),studio:take('#studio .studio-grid'),body:take('body'),links:[...document.querySelectorAll('link[rel=stylesheet]')].map(e=>e.getAttribute('href'))};
 });
 console.log('MOBILE HERO PROBE '+width+' '+JSON.stringify(data));
 await page.close();
}
await browser.close();
