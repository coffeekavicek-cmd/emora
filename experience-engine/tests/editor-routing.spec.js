import { test, expect } from '@playwright/test';

test.describe('Creator preview runtime routing',()=>{
  test('Galaxy editor uses Galaxy runtime',async({page})=>{
    await page.goto('/?mode=editor&template=love-galaxy');
    await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.ce-phone-screen .experience')).toBeVisible({timeout:10000});
    await expect(page.locator('.ce-phone-screen .pearl-motion')).toHaveCount(0);
    await expect(page.locator('.ce-phone-screen .pearl-promise')).toHaveCount(0);
  });

  test('Silk editor uses its cinematic runtime, not Pearl',async({page})=>{
    await page.goto('/?mode=editor&template=wedding-silk');
    await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.ce-phone-screen .cinematic.experience-wedding-silk')).toBeVisible({timeout:10000});
    await expect(page.locator('.ce-phone-screen .pearl-motion')).toHaveCount(0);
  });
});
