import { test, expect } from '@playwright/test';

test.describe('Pearl Linen reference',()=>{
  test('mobile creator editor switches between Edit and Preview',async({page})=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?mode=editor&template=love-pearl');
    await expect(page.locator('.creator-editor')).toBeVisible();
    await expect(page.locator('.ce-panel')).toBeVisible();
    await expect(page.locator('.ce-preview-zone')).toBeHidden();

    await page.getByRole('button',{name:'Preview'}).click();
    await expect(page.locator('.ce-preview-zone')).toBeVisible();
    await expect(page.locator('.ce-phone-screen .pearl-motion')).toBeVisible();

    const box=await page.locator('.ce-phone-screen').boundingBox();
    expect(box?.width).toBeGreaterThan(300);
    expect(box?.height).toBeGreaterThan(650);
    expect(errors).toEqual([]);
  });

  test('recipient ritual is no-scroll and wax seal opens into the letter',async({page})=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?template=love-pearl&name=Test');
    await expect(page.locator('.pearl-motion')).toBeVisible();

    const viewport=await page.evaluate(()=>({
      innerHeight:window.innerHeight,
      scrollHeight:document.documentElement.scrollHeight,
      bodyScrollHeight:document.body.scrollHeight,
    }));
    expect(viewport.scrollHeight).toBeLessThanOrEqual(viewport.innerHeight+2);
    expect(viewport.bodyScrollHeight).toBeLessThanOrEqual(viewport.innerHeight+2);

    await page.getByRole('button',{name:'Maktubni olish'}).click();
    const seal=page.getByRole('button',{name:'Wax muhrni bosib ushlab oching'});
    await expect(seal).toBeVisible();
    await expect(page.locator('.pm-seal canvas')).toHaveCount(1);

    const sealBox=await seal.boundingBox();
    expect(sealBox).not.toBeNull();
    if(sealBox){
      const x=sealBox.x+sealBox.width/2;
      const y=sealBox.y+sealBox.height/2;
      await page.mouse.move(x,y);
      await page.mouse.down();
      await page.waitForTimeout(650);
      await page.mouse.up();
    }

    await expect(page.locator('.pearl-motion')).toHaveClass(/step-ink/,{timeout:12000});
    await expect(page.locator('.pm-paper')).toBeVisible();
    expect(errors).toEqual([]);
  });
});
