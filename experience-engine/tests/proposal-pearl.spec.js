import { test, expect } from '@playwright/test';

test.describe('Pearl Promise Reborn private vault',()=>{
  test('recipient completes hold → memories → rotate → proposal question on mobile',async({page},testInfo)=>{
    test.setTimeout(60000);
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?template=proposal-pearl&name=Malika');
    await expect(page.locator('.pearl-promise-reborn')).toBeVisible();
    await expect(page.locator('.ppr-canvas')).toHaveCount(1);
    await expect(page).toHaveTitle(/Pearl Promise/);
    const viewport=await page.evaluate(()=>({h:innerHeight,doc:document.documentElement.scrollHeight,body:document.body.scrollHeight}));
    expect(viewport.doc).toBeLessThanOrEqual(viewport.h+2);expect(viewport.body).toBeLessThanOrEqual(viewport.h+2);
    await page.screenshot({path:testInfo.outputPath('01-promise-vault.png'),fullPage:true});

    const hold=page.getByRole('button',{name:'Qutini bosib ushlab oching'});
    const hb=await hold.boundingBox();expect(hb).not.toBeNull();
    if(hb){const x=hb.x+hb.width/2,y=hb.y+hb.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.waitForTimeout(950);await page.mouse.up()}
    await expect(page.locator('.pearl-promise-reborn')).toHaveClass(/phase-opening|phase-memories/,{timeout:3500});
    await expect(page.locator('.ppr-memory-orbit figure.show').first()).toBeVisible({timeout:4500});
    await page.screenshot({path:testInfo.outputPath('02-promise-memories.png'),fullPage:true});

    await expect(page.locator('.pearl-promise-reborn')).toHaveClass(/phase-rotate/,{timeout:8500});
    const drag=page.getByRole('button',{name:'Uzukni aylantiring'});const db=await drag.boundingBox();expect(db).not.toBeNull();
    if(db){const x=db.x+40,y=db.y+db.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+330,y,{steps:18});await page.mouse.up()}
    await expect(page.locator('.pearl-promise-reborn')).toHaveClass(/phase-engraving|phase-question/,{timeout:4000});
    await page.screenshot({path:testInfo.outputPath('03-promise-engraving.png'),fullPage:true});
    await expect(page.locator('.pearl-promise-reborn')).toHaveClass(/phase-question/,{timeout:5000});
    await expect(page.locator('.ppr-question h2')).toBeVisible();
    await expect(page.locator('.ppr-question em')).toContainText('Malika');
    await page.screenshot({path:testInfo.outputPath('04-promise-question.png'),fullPage:true});
    expect(errors).toEqual([]);
  });

  test('Reborn editor routes to Pearl Promise Reborn',async({page})=>{
    await page.goto('/?mode=editor&template=proposal-pearl');
    await expect(page.locator('.reborn-editor')).toBeVisible();
    await expect(page.locator('.re-screen .pearl-promise-reborn')).toBeVisible({timeout:10000});
    await expect(page.locator('.re-screen .ppr-canvas')).toHaveCount(1);
    await expect(page.locator('.re-screen .pearl-promise')).toHaveCount(0);
  });
});
