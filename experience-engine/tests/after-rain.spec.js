import { test, expect } from '@playwright/test';

test.describe('After Rain Reborn ritual',()=>{
  test('mobile recipient wipes glass → reveals memories → reaches sunrise finale',async({page},testInfo)=>{
    const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    await page.goto('/?template=apology-rain&name=Malika');
    await expect(page.locator('.after-rain-reborn')).toBeVisible();
    const viewport=await page.evaluate(()=>({h:innerHeight,doc:document.documentElement.scrollHeight,body:document.body.scrollHeight}));expect(viewport.doc).toBeLessThanOrEqual(viewport.h+2);expect(viewport.body).toBeLessThanOrEqual(viewport.h+2);
    await page.screenshot({path:testInfo.outputPath('01-rain-reborn.png'),fullPage:true});
    const fog=page.getByRole('button',{name:'Oynani barmoq bilan artib xotiralarni oching'});await fog.focus();await page.keyboard.press('Enter');
    await expect(page.locator('.after-rain-reborn')).toHaveClass(/phase-still|phase-memories/,{timeout:3500});
    await expect(page.locator('.after-rain-reborn')).toHaveClass(/phase-memories/,{timeout:3500});
    const next=page.getByRole('button',{name:/Keyingi tomchini ochish|Davom etish/});await next.click();await next.click();await next.click();
    await expect(page.locator('.after-rain-reborn')).toHaveClass(/phase-finale/,{timeout:3500});
    await expect(page.locator('.arr-finale em')).toContainText('Malika');await page.screenshot({path:testInfo.outputPath('02-rain-finale.png'),fullPage:true});expect(errors).toEqual([]);
  });
  test('Reborn editor previews After Rain',async({page})=>{await page.goto('/?mode=editor&template=apology-rain');await expect(page.locator('.reborn-editor')).toBeVisible();await expect(page.locator('.re-screen .after-rain-reborn')).toBeVisible({timeout:10000});});
});
