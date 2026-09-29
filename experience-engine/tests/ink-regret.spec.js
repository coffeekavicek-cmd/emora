import { test, expect } from '@playwright/test';

test.describe('Ink of Regret dedicated paper ritual',()=>{
  test('mobile recipient touches ink → rewrites line → reaches negative-space finale',async({page},testInfo)=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?template=apology-ink&name=Malika');
    await expect(page.locator('.ink-regret')).toBeVisible();
    await expect(page).toHaveTitle(/Ink of Regret/);

    const viewport=await page.evaluate(()=>({h:innerHeight,doc:document.documentElement.scrollHeight,body:document.body.scrollHeight}));
    expect(viewport.doc).toBeLessThanOrEqual(viewport.h+2);
    expect(viewport.body).toBeLessThanOrEqual(viewport.h+2);
    await page.screenshot({path:testInfo.outputPath('01-ink-drop.png'),fullPage:true});

    await page.getByRole('button',{name:'Siyoh tomchisiga teging'}).click();
    await expect(page.locator('.ink-regret')).toHaveClass(/phase-diffuse/,{timeout:2500});
    await expect(page.locator('.ink-regret')).toHaveClass(/phase-rewrite/,{timeout:4500});
    await page.screenshot({path:testInfo.outputPath('02-ink-rewrite.png'),fullPage:true});

    const nib=page.getByRole('button',{name:'Peroni o‘ngga sudrab gapni qayta yozing'});
    const box=await nib.boundingBox();expect(box).not.toBeNull();
    if(box){
      const x=box.x+20,y=box.y+box.height/2;
      await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+255,y,{steps:16});await page.mouse.up();
    }

    await expect(page.locator('.ink-regret')).toHaveClass(/phase-spill/,{timeout:3500});
    await page.screenshot({path:testInfo.outputPath('03-ink-spill.png'),fullPage:true});
    await expect(page.locator('.ink-regret')).toHaveClass(/phase-finale/,{timeout:5000});
    await expect(page.locator('.ir-negative-space h2')).toBeVisible();
    await expect(page.locator('.ir-negative-space em')).toContainText('Malika');
    await page.screenshot({path:testInfo.outputPath('04-ink-finale.png'),fullPage:true});
    expect(errors).toEqual([]);
  });

  test('editor preview uses Ink of Regret runtime',async({page})=>{
    await page.goto('/?mode=editor&template=apology-ink');
    await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.ce-phone-screen .ink-regret')).toBeVisible({timeout:10000});
    await expect(page.locator('.ce-phone-screen .cinematic')).toHaveCount(0);
  });
});
