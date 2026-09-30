import { test, expect } from '@playwright/test';

test.describe('Heritage Naqsh Reborn living pattern',()=>{
  test('mobile recipient starts pattern → traces → opens medallions → ceremony finale',async({page},testInfo)=>{
    const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    await page.goto('/?template=wedding-naqsh&name=Malika');await expect(page.locator('.heritage-naqsh-reborn')).toBeVisible();
    await page.getByRole('button',{name:/Naqshni boshlash/}).click();await expect(page.locator('.heritage-naqsh-reborn')).toHaveClass(/phase-trace/);
    const trace=page.getByRole('button',{name:'Naqshni barmoq bilan chizing'});await trace.focus();await page.keyboard.press('Enter');
    await expect(page.locator('.heritage-naqsh-reborn')).toHaveClass(/phase-medallions/,{timeout:3500});
    const next=page.getByRole('button',{name:/Keyingi medalyonni ochish|Markazni ochish/});await next.click();await next.click();await next.click();
    await expect(page.locator('.heritage-naqsh-reborn')).toHaveClass(/phase-finale/,{timeout:3500});await expect(page.locator('.hnr-finale em')).toContainText('Malika');await page.screenshot({path:testInfo.outputPath('naqsh-reborn-finale.png'),fullPage:true});expect(errors).toEqual([]);
  });
  test('Reborn editor previews Heritage Naqsh',async({page})=>{await page.goto('/?mode=editor&template=wedding-naqsh');await expect(page.locator('.reborn-editor')).toBeVisible();await expect(page.locator('.re-screen .heritage-naqsh-reborn')).toBeVisible({timeout:10000});});
});
