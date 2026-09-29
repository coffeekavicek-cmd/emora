import { test, expect } from '@playwright/test';

test.describe('Galaxy Confession masterpiece',()=>{
  test('creator editor keeps Galaxy media on creator side and previews the Galaxy ritual',async({page})=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?mode=editor&template=love-galaxy');
    await expect(page.locator('.creator-editor')).toBeVisible();
    await page.locator('#field-recipient').fill('Malika');
    await page.waitForTimeout(650);
    const draft=await page.evaluate(()=>localStorage.getItem('emora:draft:love-galaxy'));
    expect(draft).toContain('Malika');

    await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.ce-phone-screen .gx-experience')).toBeVisible();
    await expect(page.locator('.ce-phone-screen .pearl-motion')).toHaveCount(0);
    await expect(errors).toEqual([]);
  });

  test('recipient discovers three stars, converges the world and reaches the personalized finale',async({page},testInfo)=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?template=love-galaxy&name=Test');
    await expect(page.locator('.gx-experience')).toBeVisible();
    await expect(page.locator('input[type="file"]')).toHaveCount(0);
    await expect(page.locator('.message-card')).toHaveCount(0);

    const viewport=await page.evaluate(()=>({
      innerHeight:window.innerHeight,
      scrollHeight:document.documentElement.scrollHeight,
      bodyScrollHeight:document.body.scrollHeight,
    }));
    expect(viewport.scrollHeight).toBeLessThanOrEqual(viewport.innerHeight+2);
    expect(viewport.bodyScrollHeight).toBeLessThanOrEqual(viewport.innerHeight+2);

    await page.waitForTimeout(1500);
    await page.screenshot({path:testInfo.outputPath('01-galaxy-opening.png'),fullPage:true});
    await page.getByRole('button',{name:'Olamni ochish'}).click();

    for(let i=1;i<=3;i++){
      const star=page.getByRole('button',{name:i+'-xotira yulduzi'});
      await expect(star).toBeVisible({timeout:5000});
      await star.click();
      await page.waitForTimeout(420);
      if(i===1)await page.screenshot({path:testInfo.outputPath('02-galaxy-memory.png'),fullPage:true});
    }

    await expect(page.locator('.gx-experience')).toHaveClass(/phase-constellation/,{timeout:5000});
    await page.screenshot({path:testInfo.outputPath('03-galaxy-convergence.png'),fullPage:true});
    const core=page.getByRole('button',{name:'Galaktika markazini bosib ushlab yig‘ing'});
    const box=await core.boundingBox();
    expect(box).not.toBeNull();
    if(box){
      await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
      await page.mouse.down();
      await page.waitForTimeout(1050);
      await page.mouse.up();
    }

    await expect(page.locator('.gx-experience')).toHaveClass(/phase-finale/,{timeout:12000});
    await expect(page.locator('.gx-final-copy')).toBeVisible();
    await expect(page.locator('.gx-final-name')).toContainText('Test');
    const meta=await page.locator('.gx-final-meta').textContent();
    const points=Number((meta||'').match(/(\d+)\s*nuqta/)?.[1]||0);
    expect(points).toBeGreaterThanOrEqual(600);
    await page.screenshot({path:testInfo.outputPath('04-galaxy-finale.png'),fullPage:true});

    const save=page.getByRole('button',{name:'Keepsake saqlash'});
    const downloadPromise=page.waitForEvent('download');
    await save.click();
    const download=await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^emora-galaxy-.*\.svg$/);
    expect(errors).toEqual([]);
  });
});
