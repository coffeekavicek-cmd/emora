import { test, expect } from '@playwright/test';

test.describe('Ink Regret Reborn',()=>{
  test('mobile recipient opens ink → rewrites truth → reveals 3 memories → finale',async({page},testInfo)=>{
    const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    await page.goto('/?template=apology-ink&name=Malika');
    await expect(page.locator('.ink-regret-reborn')).toBeVisible();
    const viewport=await page.evaluate(()=>({h:innerHeight,doc:document.documentElement.scrollHeight,body:document.body.scrollHeight}));
    expect(viewport.doc).toBeLessThanOrEqual(viewport.h+2);expect(viewport.body).toBeLessThanOrEqual(viewport.h+2);
    await page.getByRole('button',{name:'Siyoh idishini oching'}).click();
    await expect(page.locator('.ink-regret-reborn')).toHaveClass(/phase-diffuse/,{timeout:2500});
    await expect(page.locator('.ink-regret-reborn')).toHaveClass(/phase-rewrite/,{timeout:5000});
    const nib=page.getByRole('button',{name:'Gapni pero bilan qayta yozing'}),box=await nib.boundingBox();expect(box).not.toBeNull();
    if(box){const x=box.x+20,y=box.y+box.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+270,y,{steps:18});await page.mouse.up()}
    await expect(page.locator('.ink-regret-reborn')).toHaveClass(/phase-memories/,{timeout:3500});
    for(let i=0;i<3;i++)await page.getByRole('button',{name:/Keyingi negativni yoritish|Davom etish/}).click();
    await expect(page.locator('.ink-regret-reborn')).toHaveClass(/phase-finale/,{timeout:4000});
    await expect(page.locator('.irr-finale em')).toContainText('Malika');
    await page.screenshot({path:testInfo.outputPath('ink-reborn-finale.png'),fullPage:true});
    expect(errors).toEqual([]);
  });

  test('Reborn editor previews Ink Regret',async({page})=>{
    await page.goto('/?mode=editor&template=apology-ink');
    await expect(page.locator('.reborn-editor')).toBeVisible();
    await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.re-screen .ink-regret-reborn')).toBeVisible({timeout:10000});
  });
});
