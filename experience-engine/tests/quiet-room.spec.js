import { test, expect } from '@playwright/test';

test.describe('Quiet Room Reborn ritual',()=>{
  test('mobile recipient pulls light → reads → reveals negatives → blackout → finale',async({page},testInfo)=>{
    test.setTimeout(45000);
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?template=apology-quiet&name=Malika');
    await expect(page.locator('.quiet-room-reborn')).toBeVisible();
    await expect(page).toHaveTitle(/Quiet Room/);
    const viewport=await page.evaluate(()=>({h:innerHeight,doc:document.documentElement.scrollHeight,body:document.body.scrollHeight}));
    expect(viewport.doc).toBeLessThanOrEqual(viewport.h+2);expect(viewport.body).toBeLessThanOrEqual(viewport.h+2);
    await page.screenshot({path:testInfo.outputPath('01-quiet-reborn-dark.png'),fullPage:true});

    const chain=page.getByRole('button',{name:'Lampochka zanjirini pastga torting'});
    const cb=await chain.boundingBox();expect(cb).not.toBeNull();
    if(cb){const x=cb.x+cb.width/2,y=cb.y+80;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x,y+165,{steps:15});await page.mouse.up()}
    await expect(page.locator('.quiet-room-reborn')).toHaveClass(/phase-light|phase-letter/,{timeout:3500});
    await expect(page.locator('.quiet-room-reborn')).toHaveClass(/phase-letter/,{timeout:4000});
    await expect(page.locator('.qrr-letter article span.show')).toHaveCount(3,{timeout:5500});
    await page.screenshot({path:testInfo.outputPath('02-quiet-reborn-letter.png'),fullPage:true});

    await expect(page.locator('.quiet-room-reborn')).toHaveClass(/phase-negatives/,{timeout:7000});
    const next=page.getByRole('button',{name:/Keyingi negativni yoritish|Davom etish/});
    await next.click();await next.click();await next.click();
    await expect(page.locator('.quiet-room-reborn')).toHaveClass(/phase-blackout/,{timeout:3500});
    await expect(page.locator('.quiet-room-reborn')).toHaveClass(/phase-phosphor|phase-finale/,{timeout:3500});
    await expect(page.locator('.quiet-room-reborn')).toHaveClass(/phase-finale/,{timeout:4000});
    await expect(page.locator('.qrr-finale h2')).toBeVisible();
    await expect(page.locator('.qrr-finale em')).toContainText('Malika');
    await page.screenshot({path:testInfo.outputPath('03-quiet-reborn-finale.png'),fullPage:true});
    expect(errors).toEqual([]);
  });

  test('Reborn editor previews Quiet Room Reborn',async({page})=>{
    await page.goto('/?mode=editor&template=apology-quiet');
    await expect(page.locator('.reborn-editor')).toBeVisible();
    await expect(page.locator('.re-screen .quiet-room-reborn')).toBeVisible({timeout:10000});
    await expect(page.locator('.re-screen .quiet-room')).toHaveCount(0);
  });
});
