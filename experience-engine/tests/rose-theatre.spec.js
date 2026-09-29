import { test, expect } from '@playwright/test';

test.describe('Rose Theatre dedicated ritual',()=>{
  test('mobile recipient opens curtain → memories → petal → encore finale',async({page},testInfo)=>{
    const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    await page.goto('/?template=love-rose&name=Malika');
    await expect(page.locator('.rose-theatre')).toBeVisible();await expect(page).toHaveTitle(/Rose Theatre/);
    const viewport=await page.evaluate(()=>({h:innerHeight,doc:document.documentElement.scrollHeight,body:document.body.scrollHeight}));
    expect(viewport.doc).toBeLessThanOrEqual(viewport.h+2);expect(viewport.body).toBeLessThanOrEqual(viewport.h+2);
    await page.screenshot({path:testInfo.outputPath('01-rose-opening.png'),fullPage:true});
    await page.getByRole('button',{name:/Sahnani ochish/}).click();
    const curtain=page.getByRole('button',{name:'Velvet pardani oching'});const cb=await curtain.boundingBox();expect(cb).not.toBeNull();
    if(cb){const x=cb.x+cb.width/2,y=cb.y+cb.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+215,y,{steps:15});await page.mouse.up()}
    await expect(page.locator('.rose-theatre')).toHaveClass(/phase-memories/,{timeout:4000});
    await expect(page.locator('.rt-filmline figure.show')).toHaveCount(3,{timeout:5000});
    await page.screenshot({path:testInfo.outputPath('02-rose-memories.png'),fullPage:true});
    await expect(page.locator('.rose-theatre')).toHaveClass(/phase-petal/,{timeout:6000});
    const petal=page.getByRole('button',{name:'Atirgul yaprog‘ini uzing'});const pb=await petal.boundingBox();expect(pb).not.toBeNull();
    if(pb){const x=pb.x+pb.width/2,y=pb.y+pb.height*.35;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x,y+135,{steps:13});await page.mouse.up()}
    await expect(page.locator('.rose-theatre')).toHaveClass(/phase-finale/,{timeout:4500});
    await expect(page.locator('.rt-petal-canvas')).toBeVisible();await expect(page.locator('.rt-finale-copy h2')).toBeVisible();
    await page.screenshot({path:testInfo.outputPath('03-rose-finale.png'),fullPage:true});expect(errors).toEqual([]);
  });
  test('editor preview uses Rose Theatre runtime',async({page})=>{
    await page.goto('/?mode=editor&template=love-rose');await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.ce-phone-screen .rose-theatre')).toBeVisible({timeout:10000});await expect(page.locator('.ce-phone-screen .cinematic')).toHaveCount(0);
  });
});