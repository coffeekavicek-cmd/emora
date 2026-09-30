import { test, expect } from '@playwright/test';

test.describe('Aurora Paper Reborn birthday object',()=>{
  test('mobile recipient pulls ribbon → opens photo layers → tears final paper → sky finale',async({page},testInfo)=>{
    const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    await page.goto('/?template=birthday-aurora&name=Malika');await expect(page.locator('.aurora-paper-reborn')).toBeVisible();
    const ribbon=page.getByRole('button',{name:'Sovg‘a lentasini o‘ngga torting'}),rb=await ribbon.boundingBox();expect(rb).not.toBeNull();if(rb){const x=rb.x+20,y=rb.y+rb.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+250,y,{steps:18});await page.mouse.up()}
    await expect(page.locator('.aurora-paper-reborn')).toHaveClass(/phase-layers/,{timeout:3500});
    const next=page.getByRole('button',{name:/Keyingi qatlamni ochish|Davom etish/});await next.click();await next.click();await next.click();
    await expect(page.locator('.aurora-paper-reborn')).toHaveClass(/phase-tear/,{timeout:3500});
    const tear=page.getByRole('button',{name:'Oxirgi qog‘oz qatlamini yirting'}),tb=await tear.boundingBox();expect(tb).not.toBeNull();if(tb){const x=tb.x+20,y=tb.y+tb.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+270,y,{steps:18});await page.mouse.up()}
    await expect(page.locator('.aurora-paper-reborn')).toHaveClass(/phase-finale/,{timeout:3500});await expect(page.locator('.apr-finale h2')).toContainText('Malika');await page.screenshot({path:testInfo.outputPath('aurora-reborn-finale.png'),fullPage:true});expect(errors).toEqual([]);
  });
  test('Reborn editor previews Aurora Paper',async({page})=>{await page.goto('/?mode=editor&template=birthday-aurora');await expect(page.locator('.reborn-editor')).toBeVisible();await expect(page.locator('.re-screen .aurora-paper-reborn')).toBeVisible({timeout:10000});});
});
