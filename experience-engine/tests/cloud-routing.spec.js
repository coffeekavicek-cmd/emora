import { test, expect } from '@playwright/test';

async function collectErrors(page){
  const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  return errors;
}

test.describe('EMORA cloud routing guards',()=>{
  test('editor route wins over site query used for draft UUID',async({page})=>{
    const errors=await collectErrors(page);
    await page.goto('/?mode=editor&template=love-pearl&site=00000000-0000-0000-0000-000000000000');
    await expect(page.locator('.reborn-editor')).toBeVisible();
    await expect(page.locator('.published-site-state')).toHaveCount(0);
    await expect(page.getByRole('button',{name:'CLICK'})).toBeDisabled();
    await expect(page.getByRole('button',{name:'PAYME'})).toBeDisabled();
    expect(errors).toEqual([]);
  });

  test('plain site query is reserved for published recipient loader',async({page})=>{
    const errors=await collectErrors(page);
    await page.goto('/?site=qa-not-published');
    await expect(page.locator('.published-site-state')).toBeVisible();
    await expect(page.locator('.reborn-editor')).toHaveCount(0);
    await expect(page.locator('.published-site-state')).toContainText('EMORA');
    expect(errors).toEqual([]);
  });

  test('checkout stays gated before a cloud project is ready',async({page})=>{
    await page.goto('/?mode=editor&template=wedding-silk');
    await expect(page.locator('.reborn-editor')).toBeVisible();
    await expect(page.getByRole('button',{name:'CLICK'})).toBeDisabled();
    await expect(page.getByRole('button',{name:'PAYME'})).toBeDisabled();
    await expect(page.locator('.re-checkout')).toContainText('Avval draftni saqlang');
  });
});
