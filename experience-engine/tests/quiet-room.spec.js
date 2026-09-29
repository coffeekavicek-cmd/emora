import { test, expect } from '@playwright/test';

test.describe('Quiet Room dedicated ritual',()=>{
  test('mobile recipient pulls light → reads → blackout → warm return',async({page},testInfo)=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?template=apology-quiet&name=Malika');
    await expect(page.locator('.quiet-room')).toBeVisible();
    await expect(page).toHaveTitle(/Quiet Room/);
    await page.screenshot({path:testInfo.outputPath('01-quiet-dark.png'),fullPage:true});

    const viewport=await page.evaluate(()=>({h:innerHeight,doc:document.documentElement.scrollHeight,body:document.body.scrollHeight}));
    expect(viewport.doc).toBeLessThanOrEqual(viewport.h+2);
    expect(viewport.body).toBeLessThanOrEqual(viewport.h+2);

    const chain=page.getByRole('button',{name:'Chiroq zanjirini pastga torting'});
    const cb=await chain.boundingBox();expect(cb).not.toBeNull();
    if(cb){
      const x=cb.x+cb.width/2,y=cb.y+cb.height*.48;
      await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x,y+145,{steps:14});await page.mouse.up();
    }
    await expect(page.locator('.quiet-room')).toHaveClass(/phase-lit|phase-listen/,{timeout:3500});
    await expect(page.locator('.quiet-room')).toHaveClass(/phase-listen/,{timeout:4500});
    await expect(page.locator('.qr-lines .show')).toHaveCount(3,{timeout:6000});
    await page.screenshot({path:testInfo.outputPath('02-quiet-letter.png'),fullPage:true});

    await expect(page.locator('.quiet-room')).toHaveClass(/phase-blackout|phase-finale/,{timeout:9000});
    await expect(page.locator('.quiet-room')).toHaveClass(/phase-finale/,{timeout:3500});
    await expect(page.locator('.qr-finale h2')).toBeVisible();
    await page.screenshot({path:testInfo.outputPath('03-quiet-finale.png'),fullPage:true});
    expect(errors).toEqual([]);
  });

  test('editor preview uses Quiet Room runtime',async({page})=>{
    await page.goto('/?mode=editor&template=apology-quiet');
    await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.ce-phone-screen .quiet-room')).toBeVisible({timeout:10000});
    await expect(page.locator('.ce-phone-screen .cinematic')).toHaveCount(0);
  });
});
