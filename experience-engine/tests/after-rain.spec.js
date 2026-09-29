import { test, expect } from '@playwright/test';

test.describe('After Rain dedicated glass ritual',()=>{
  test('mobile recipient wipes fog → reveals apology → reaches sunbreak finale',async({page},testInfo)=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?template=apology-rain&name=Malika');
    await expect(page.locator('.after-rain')).toBeVisible();
    await expect(page).toHaveTitle(/After Rain/);

    const viewport=await page.evaluate(()=>({h:innerHeight,doc:document.documentElement.scrollHeight,body:document.body.scrollHeight}));
    expect(viewport.doc).toBeLessThanOrEqual(viewport.h+2);
    expect(viewport.body).toBeLessThanOrEqual(viewport.h+2);
    await page.screenshot({path:testInfo.outputPath('01-rain-storm.png'),fullPage:true});

    const glass=page.getByRole('button',{name:'Oynani barmoq bilan artib oching'});
    const box=await glass.boundingBox();expect(box).not.toBeNull();
    if(box){
      const left=box.x+box.width*.08,right=box.x+box.width*.92;
      const top=box.y+box.height*.12,bottom=box.y+box.height*.80;
      await page.mouse.move(left,top);await page.mouse.down();
      for(let row=0;row<8;row++){
        const y=top+(bottom-top)*(row/7);
        const x=row%2===0?right:left;
        await page.mouse.move(x,y,{steps:16});
      }
      await page.mouse.up();
    }

    await expect(page.locator('.after-rain')).toHaveClass(/phase-still|phase-finale/,{timeout:5000});
    await expect(page.locator('.ar-reveal p.show')).toHaveCount(3,{timeout:3500});
    await page.screenshot({path:testInfo.outputPath('02-rain-cleared.png'),fullPage:true});

    await expect(page.locator('.after-rain')).toHaveClass(/phase-finale/,{timeout:4500});
    await expect(page.locator('.ar-finale h2')).toBeVisible();
    await expect(page.locator('.ar-finale em')).toContainText('Malika');
    await page.screenshot({path:testInfo.outputPath('03-rain-sunbreak.png'),fullPage:true});
    expect(errors).toEqual([]);
  });

  test('editor preview uses After Rain runtime',async({page})=>{
    await page.goto('/?mode=editor&template=apology-rain');
    await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.ce-phone-screen .after-rain')).toBeVisible({timeout:10000});
    await expect(page.locator('.ce-phone-screen .cinematic')).toHaveCount(0);
  });
});
