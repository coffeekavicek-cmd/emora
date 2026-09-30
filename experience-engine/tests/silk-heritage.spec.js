import { test, expect } from '@playwright/test';

test.describe('Silk Heritage Reborn',()=>{
  test('mobile guest pulls silk → gold stitch → opens 3 medallions → invitation',async({page},testInfo)=>{
    const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    await page.goto('/?template=wedding-silk&name=Aziza&date=2026-10-10T18%3A00&venue=Silk%20Garden&address=Tashkent');
    await expect(page.locator('.silk-heritage-reborn')).toBeVisible();
    const viewport=await page.evaluate(()=>({h:innerHeight,doc:document.documentElement.scrollHeight,body:document.body.scrollHeight}));
    expect(viewport.doc).toBeLessThanOrEqual(viewport.h+2);expect(viewport.body).toBeLessThanOrEqual(viewport.h+2);
    const pull=page.getByRole('button',{name:'Ipak ipini o‘ngga torting'}),pb=await pull.boundingBox();expect(pb).not.toBeNull();
    if(pb){const x=pb.x+20,y=pb.y+pb.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+300,y,{steps:18});await page.mouse.up()}
    await expect(page.locator('.silk-heritage-reborn')).toHaveClass(/phase-stitch/,{timeout:3500});
    await expect(page.locator('.silk-heritage-reborn')).toHaveClass(/phase-gallery/,{timeout:6500});
    for(let i=0;i<3;i++)await page.getByRole('button',{name:/Keyingi naqshni ochish|Davom etish/}).click();
    await expect(page.locator('.silk-heritage-reborn')).toHaveClass(/phase-invitation/,{timeout:3500});
    await expect(page.locator('.shr-invitation h2')).toContainText('Aziza');
    await page.screenshot({path:testInfo.outputPath('silk-reborn-invitation.png'),fullPage:true});
    expect(errors).toEqual([]);
  });

  test('Reborn editor previews Silk Heritage',async({page})=>{
    await page.goto('/?mode=editor&template=wedding-silk');
    await expect(page.locator('.reborn-editor')).toBeVisible();
    await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.re-screen .silk-heritage-reborn')).toBeVisible({timeout:10000});
  });
});
