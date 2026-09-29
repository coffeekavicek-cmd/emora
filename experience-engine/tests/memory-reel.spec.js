import { test, expect } from '@playwright/test';

test.describe('Memory Reel dedicated cinematic',()=>{
  test('mobile recipient completes reel → scrub → hold → film burn',async({page},testInfo)=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?template=birthday-memory&name=Malika');
    await expect(page.locator('.memory-reel')).toBeVisible();
    await expect(page).toHaveTitle(/Memory Reel/);
    await page.screenshot({path:testInfo.outputPath('01-memory-opening.png'),fullPage:true});

    const viewport=await page.evaluate(()=>({h:innerHeight,doc:document.documentElement.scrollHeight,body:document.body.scrollHeight}));
    expect(viewport.doc).toBeLessThanOrEqual(viewport.h+2);
    expect(viewport.body).toBeLessThanOrEqual(viewport.h+2);

    await page.getByRole('button',{name:/Filmni boshlash/}).click();
    await expect(page.locator('.memory-reel')).toHaveClass(/phase-reel/,{timeout:4000});

    const reel=page.getByRole('button',{name:'Reelni aylantiring'});
    const rb=await reel.boundingBox();expect(rb).not.toBeNull();
    if(rb){
      const x=rb.x+rb.width/2,y=rb.y+rb.height/2;
      await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+235,y,{steps:16});await page.mouse.up();
    }
    await expect(page.locator('.memory-reel')).toHaveClass(/phase-scrub/,{timeout:4000});
    await page.screenshot({path:testInfo.outputPath('02-memory-scrub.png'),fullPage:true});

    const scrub=page.getByRole('button',{name:'Filmni chapdan o‘ngga suring'});
    const sb=await scrub.boundingBox();expect(sb).not.toBeNull();
    if(sb){
      const x=sb.x+30,y=sb.y+sb.height/2;
      await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+255,y,{steps:18});await page.mouse.up();
    }
    await expect(page.locator('.memory-reel')).toHaveClass(/phase-hold/,{timeout:4000});

    const hold=page.getByRole('button',{name:'Tanlangan kadrni bosib ushlab turing'});
    const hb=await hold.boundingBox();expect(hb).not.toBeNull();
    if(hb){
      const x=hb.x+hb.width/2,y=hb.y+hb.height/2;
      await page.mouse.move(x,y);

      await page.mouse.down();await page.waitForTimeout(280);await page.mouse.up();
      await page.waitForTimeout(450);
      await expect(page.locator('.memory-reel')).toHaveClass(/phase-hold/);

      await page.mouse.down();await page.waitForTimeout(900);await page.mouse.up();
    }

    await expect(page.locator('.memory-reel')).toHaveClass(/phase-burn|phase-finale/,{timeout:4000});
    await page.screenshot({path:testInfo.outputPath('03-memory-burn.png'),fullPage:true});
    await expect(page.locator('.memory-reel')).toHaveClass(/phase-finale/,{timeout:5000});
    await expect(page.locator('.mr-finale-copy')).toBeVisible();
    await page.screenshot({path:testInfo.outputPath('04-memory-finale.png'),fullPage:true});
    expect(errors).toEqual([]);
  });

  test('editor preview uses Memory Reel runtime',async({page})=>{
    await page.goto('/?mode=editor&template=birthday-memory');
    await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.ce-phone-screen .memory-reel')).toBeVisible({timeout:10000});
    await expect(page.locator('.ce-phone-screen .cinematic')).toHaveCount(0);
  });
});
