import { test, expect } from '@playwright/test';
test.describe('Night Garden dedicated ritual',()=>{
  test('lights lanterns → firefly name → opens gate → invitation',async({page},testInfo)=>{
    const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    await page.goto('/?template=wedding-garden&name=Aziza&date=2026-10-10T18%3A00&venue=Garden%20Hall&address=Tashkent');
    await expect(page.locator('.night-garden')).toBeVisible();await expect(page).toHaveTitle(/Night Garden/);
    const v=await page.evaluate(()=>({h:innerHeight,d:document.documentElement.scrollHeight,b:document.body.scrollHeight}));expect(v.d).toBeLessThanOrEqual(v.h+2);expect(v.b).toBeLessThanOrEqual(v.h+2);
    await page.getByRole('button',{name:/Bog‘ga kirish/}).click();
    for(let i=1;i<=3;i++){await page.getByRole('button',{name:i+'-fonarni yoqing'}).click();await page.waitForTimeout(140)}
    await expect(page.locator('.night-garden')).toHaveClass(/phase-name|phase-gate/,{timeout:2500});
    await page.screenshot({path:testInfo.outputPath('01-garden-name.png'),fullPage:true});
    await expect(page.locator('.night-garden')).toHaveClass(/phase-gate/,{timeout:4500});
    const gate=page.getByRole('button',{name:'Bog‘ darvozasini oching'}),gb=await gate.boundingBox();expect(gb).not.toBeNull();
    if(gb){const x=gb.x+gb.width/2,y=gb.y+gb.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+205,y,{steps:15});await page.mouse.up()}
    await expect(page.locator('.night-garden')).toHaveClass(/phase-finale/,{timeout:4000});await expect(page.locator('.ng-event')).toContainText('Garden Hall');
    await expect(page.getByRole('button',{name:'Kalendar +'})).toBeVisible();await expect(page.getByRole('link',{name:'Xaritada ochish ↗'})).toBeVisible();
    await page.screenshot({path:testInfo.outputPath('02-garden-finale.png'),fullPage:true});expect(errors).toEqual([]);
  });
  test('editor uses Night Garden runtime',async({page})=>{await page.goto('/?mode=editor&template=wedding-garden');await page.getByRole('button',{name:'Preview',exact:true}).click();await expect(page.locator('.ce-phone-screen .night-garden')).toBeVisible({timeout:10000});await expect(page.locator('.ce-phone-screen .cinematic')).toHaveCount(0)});
});