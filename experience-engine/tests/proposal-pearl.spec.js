import { test, expect } from '@playwright/test';

test.describe('Pearl Promise flagship private vault',()=>{
  test('hold → gem refractions → rotate engraving → proposal → accepted finale',async({page},testInfo)=>{
    test.setTimeout(60000);const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    await page.goto('/?template=proposal-pearl&name=Malika');await expect(page.locator('.pearl-promise-reborn')).toBeVisible();await expect(page.locator('.ppr-canvas')).toHaveCount(1);
    const hold=page.getByRole('button',{name:'Qutini bosib ushlab oching'}),hb=await hold.boundingBox();expect(hb).not.toBeNull();if(hb){const x=hb.x+hb.width/2,y=hb.y+hb.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.waitForTimeout(950);await page.mouse.up()}
    await expect(page.locator('.pearl-promise-reborn')).toHaveClass(/phase-opening|phase-memories/,{timeout:3500});await expect(page.locator('.ppr2-refractions figure.show').first()).toBeVisible({timeout:4500});
    await expect(page.locator('.pearl-promise-reborn')).toHaveClass(/phase-rotate/,{timeout:8500});const drag=page.getByRole('button',{name:'Uzukni aylantiring'}),db=await drag.boundingBox();expect(db).not.toBeNull();if(db){const x=db.x+40,y=db.y+db.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+330,y,{steps:18});await page.mouse.up()}
    await expect(page.locator('.pearl-promise-reborn')).toHaveClass(/phase-question/,{timeout:6000});await expect(page.locator('.ppr-question em')).toContainText('Malika');await page.getByRole('button',{name:'HA',exact:true}).click();
    await expect(page.locator('.pearl-promise-reborn')).toHaveClass(/phase-accepted/);await expect(page.locator('.ppr2-accepted h2')).toContainText('Malika');await expect(page.locator('.ppr2-sparks i')).toHaveCount(42);await page.screenshot({path:testInfo.outputPath('pearl-promise-accepted.png'),fullPage:true});expect(errors).toEqual([]);
  });
  test('editor routes to flagship Pearl Promise',async({page})=>{await page.goto('/?mode=editor&template=proposal-pearl');await expect(page.locator('.reborn-editor')).toBeVisible();const preview=page.getByRole('button',{name:'Preview',exact:true});if(await preview.isVisible())await preview.click();await expect(page.locator('.re-screen .pearl-promise-reborn')).toBeVisible({timeout:10000});await expect(page.locator('.re-screen .ppr-canvas')).toHaveCount(1);await expect(page.locator('.re-screen .ppr2')).toBeVisible();});
});
