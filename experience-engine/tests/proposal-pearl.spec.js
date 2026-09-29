import { test, expect } from '@playwright/test';

test.describe('Pearl Promise true 3D reference',()=>{
  test('recipient completes hold → rotate → proposal question on mobile',async({page},testInfo)=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?template=proposal-pearl&name=Malika');
    await expect(page.locator('.pearl-promise')).toBeVisible();
    await expect(page.locator('.pp-canvas')).toHaveCount(1);
    await expect(page).toHaveTitle(/Pearl Promise/);

    const viewport=await page.evaluate(()=>({
      innerHeight:window.innerHeight,
      scrollHeight:document.documentElement.scrollHeight,
      bodyScrollHeight:document.body.scrollHeight,
    }));
    expect(viewport.scrollHeight).toBeLessThanOrEqual(viewport.innerHeight+2);
    expect(viewport.bodyScrollHeight).toBeLessThanOrEqual(viewport.innerHeight+2);
    await page.screenshot({path:testInfo.outputPath('01-proposal-closed.png'),fullPage:true});

    const hold=page.getByRole('button',{name:'Uzuk qutisini bosib ushlab oching'});
    const box=await hold.boundingBox();
    expect(box).not.toBeNull();
    if(box){
      const x=box.x+box.width/2,y=box.y+box.height/2;
      await page.mouse.move(x,y);

      await page.mouse.down();
      await page.waitForTimeout(320);
      await page.mouse.up();
      await page.waitForTimeout(850);
      await expect(page.locator('.pearl-promise')).toHaveClass(/phase-intro/);

      await page.mouse.down();
      await page.waitForTimeout(1030);
      await page.mouse.up();
    }

    await expect(page.locator('.pearl-promise')).toHaveClass(/phase-memories/,{timeout:5000});
    await expect(page.locator('.pp-memories article.show')).toHaveCount(1);
    await page.screenshot({path:testInfo.outputPath('02-proposal-open.png'),fullPage:true});

    await expect(page.locator('.pearl-promise')).toHaveClass(/phase-rotate/,{timeout:8000});
    const drag=page.getByRole('button',{name:'Uzukni aylantiring'});
    const dragBox=await drag.boundingBox();
    expect(dragBox).not.toBeNull();
    if(dragBox){
      const x=dragBox.x+45,y=dragBox.y+dragBox.height/2;
      await page.mouse.move(x,y);
      await page.mouse.down();
      await page.mouse.move(x+330,y,{steps:18});
      await page.mouse.up();
    }

    await expect(page.locator('.pearl-promise')).toHaveClass(/phase-engraving|phase-question/,{timeout:4000});
    await page.screenshot({path:testInfo.outputPath('03-proposal-engraving.png'),fullPage:true});
    await expect(page.locator('.pearl-promise')).toHaveClass(/phase-question/,{timeout:5000});
    await expect(page.locator('.pp-question h2')).toContainText('boblarini');
    await expect(page.locator('.pp-question')).toBeVisible();
    await page.screenshot({path:testInfo.outputPath('04-proposal-question.png'),fullPage:true});

    expect(errors).toEqual([]);
  });

  test('creator preview routes to Pearl Promise 3D instead of Pearl Linen',async({page})=>{
    await page.goto('/?mode=editor&template=proposal-pearl');
    await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.ce-phone-screen .pearl-promise')).toBeVisible({timeout:10000});
    await expect(page.locator('.ce-phone-screen .pp-canvas')).toHaveCount(1);
    await expect(page.locator('.ce-phone-screen .pearl-motion')).toHaveCount(0);
  });
});
