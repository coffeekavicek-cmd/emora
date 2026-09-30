import { test, expect } from '@playwright/test';

test.describe('After Rain flagship ritual',()=>{
  test('wipes glass → sees refracted memories → traces mark → reaches sunrise',async({page},testInfo)=>{
    const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    await page.goto('/?template=apology-rain&name=Malika');await expect(page.locator('.after-rain-reborn')).toBeVisible();
    const fog=page.getByRole('button',{name:'Oynani barmoq bilan artib xotiralarni oching'});await fog.focus();await page.keyboard.press('Enter');
    await expect(page.locator('.after-rain-reborn')).toHaveClass(/phase-drops/,{timeout:3500});await expect(page.locator('.arr2-droplets figure')).toHaveCount(3);
    await page.getByRole('button',{name:'Oynaga qaytish →'}).click();await expect(page.locator('.after-rain-reborn')).toHaveClass(/phase-trace/);
    const trace=page.getByRole('button',{name:'Bug‘langan oynaga barmoq bilan belgi chizing'});await trace.focus();await page.keyboard.press('Enter');
    await expect(page.locator('.after-rain-reborn')).toHaveClass(/phase-rain-stop|phase-sunrise/,{timeout:2500});await expect(page.locator('.after-rain-reborn')).toHaveClass(/phase-sunrise/,{timeout:3500});
    await expect(page.locator('.arr-finale em')).toContainText('Malika');await page.screenshot({path:testInfo.outputPath('after-rain-flagship-sunrise.png'),fullPage:true});expect(errors).toEqual([]);
  });
  test('editor previews flagship After Rain',async({page})=>{await page.goto('/?mode=editor&template=apology-rain');await expect(page.locator('.reborn-editor')).toBeVisible();const preview=page.getByRole('button',{name:'Preview',exact:true});if(await preview.isVisible())await preview.click();await expect(page.locator('.re-screen .after-rain-reborn')).toBeVisible({timeout:10000});await expect(page.locator('.re-screen .arr2')).toBeVisible();});
});
