import { test, expect } from '@playwright/test';

test.describe('Sky Promise dedicated dawn ritual',()=>{
  test('mobile recipient connects stars → drags horizon → reaches sunrise question',async({page},testInfo)=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?template=proposal-sky&name=Malika');
    await expect(page.locator('.sky-promise')).toBeVisible();
    await expect(page.locator('.sp-canvas')).toHaveCount(1);
    await expect(page).toHaveTitle(/Sky Promise/);

    const viewport=await page.evaluate(()=>({h:innerHeight,doc:document.documentElement.scrollHeight,body:document.body.scrollHeight}));
    expect(viewport.doc).toBeLessThanOrEqual(viewport.h+2);
    expect(viewport.body).toBeLessThanOrEqual(viewport.h+2);
    await page.screenshot({path:testInfo.outputPath('01-sky-night.png'),fullPage:true});

    await page.getByRole('button',{name:'1-yulduzni ulang'}).click();
    await page.getByRole('button',{name:'2-yulduzni ulang'}).click();
    await page.getByRole('button',{name:'3-yulduzni ulang'}).click();
    await expect(page.locator('.sky-promise')).toHaveClass(/phase-horizon/,{timeout:4000});

    const horizon=page.getByRole('button',{name:'Ufqqa yuqoriga suring'});
    const box=await horizon.boundingBox();expect(box).not.toBeNull();
    if(box){
      const x=box.x+box.width/2,y=box.y+box.height-22;
      await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x,y-250,{steps:18});await page.mouse.up();
    }

    await expect(page.locator('.sky-promise')).toHaveClass(/phase-predawn|phase-finale/,{timeout:3500});
    await page.screenshot({path:testInfo.outputPath('02-sky-predawn.png'),fullPage:true});
    await expect(page.locator('.sky-promise')).toHaveClass(/phase-finale/,{timeout:4000});
    await expect(page.locator('.sp-finale h2')).toBeVisible();
    await expect(page.locator('.sp-finale em')).toContainText('Malika');
    await page.screenshot({path:testInfo.outputPath('03-sky-sunrise.png'),fullPage:true});
    expect(errors).toEqual([]);
  });

  test('editor preview uses Sky Promise runtime',async({page})=>{
    await page.goto('/?mode=editor&template=proposal-sky');
    await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.ce-phone-screen .sky-promise')).toBeVisible({timeout:10000});
    await expect(page.locator('.ce-phone-screen .cinematic')).toHaveCount(0);
  });
});
