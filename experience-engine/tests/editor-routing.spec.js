import { test, expect } from '@playwright/test';

test.describe('Reborn Creator runtime routing',()=>{
  test('Galaxy editor uses Galaxy Confession Reborn',async({page})=>{
    await page.goto('/?mode=editor&template=love-galaxy');
    await expect(page.locator('.reborn-editor')).toBeVisible();
    await expect(page.locator('.re-screen .galaxy-confession-reborn')).toBeVisible({timeout:10000});
    await expect(page.locator('.re-screen .cinematic')).toHaveCount(0);
  });

  test('Silk editor uses Silk Heritage Reborn',async({page})=>{
    await page.goto('/?mode=editor&template=wedding-silk');
    await expect(page.locator('.reborn-editor')).toBeVisible();
    await expect(page.locator('.re-screen .silk-heritage-reborn')).toBeVisible({timeout:10000});
    await expect(page.locator('.re-screen .cinematic')).toHaveCount(0);
  });

  test('every editor exposes required media controls',async({page})=>{
    await page.goto('/?mode=editor&template=proposal-sky');
    await expect(page.locator('.re-media')).toContainText('Media · required');
    await expect(page.getByText('Musiqa preset')).toBeVisible();
    await expect(page.getByText('Rasmlar',{exact:true})).toBeVisible();
    await expect(page.getByText('Asosiy video')).toBeVisible();
  });
});
