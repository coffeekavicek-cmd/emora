import { test, expect } from '@playwright/test';

test.describe('Galaxy Confession living-world reference',()=>{
  test('creator editor owns Galaxy media while recipient preview stays clean',async({page})=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?mode=editor&template=love-galaxy');
    await expect(page.locator('.creator-editor')).toBeVisible();
    await expect(page.getByText('Galaxy discoveries')).toBeVisible();

    const creatorFileInputs=page.locator('.ce-panel input[type="file"]');
    expect(await creatorFileInputs.count()).toBeGreaterThanOrEqual(1);

    await page.getByRole('button',{name:'Preview'}).click();
    await expect(page.locator('.ce-phone-screen .galaxy-reference')).toBeVisible();
    await expect(page.locator('.ce-phone-screen input[type="file"]')).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test('recipient manipulates the world and reaches finale without scroll',async({page},testInfo)=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?template=love-galaxy&name=Test');
    await expect(page.locator('.galaxy-reference')).toBeVisible();
    await expect(page).toHaveTitle(/Galaxy Confession/);
    await expect(page.locator('input[type="file"]')).toHaveCount(0);

    await expect(page.getByRole('button',{name:'Olamga kirish'})).toBeEnabled({timeout:12000});
    await page.screenshot({path:testInfo.outputPath('galaxy-01-opening.png'),fullPage:true});
    await page.getByRole('button',{name:'Olamga kirish'}).click();
    await expect(page.locator('.galaxy-reference')).toHaveClass(/phase-explore/);

    const canvas=page.locator('.gr-world canvas');
    await expect(canvas).toBeVisible();
    const box=await canvas.boundingBox();
    expect(box).not.toBeNull();
    if(!box)return;

    const sx=box.x+box.width*.5,sy=box.y+box.height*.5;
    await page.mouse.move(sx,sy);
    await page.mouse.down();
    await page.mouse.move(sx+95,sy-18,{steps:12});
    await page.mouse.up();

    const stars=[[.25,.33],[.73,.29],[.57,.72]];
    for(let i=0;i<stars.length;i++){
      const [px,py]=stars[i];
      await page.mouse.click(box.x+box.width*px,box.y+box.height*py);
      await page.waitForTimeout(350);
    }

    await expect(page.locator('.galaxy-reference')).toHaveClass(/phase-constellation/,{timeout:5000});
    await page.screenshot({path:testInfo.outputPath('galaxy-02-constellation.png'),fullPage:true});

    const halo=page.getByRole('button',{name:'Galaktika markazini bosib ushlab yig‘ing'});
    await expect(halo).toBeVisible();
    const hb=await halo.boundingBox();
    expect(hb).not.toBeNull();
    if(hb){
      await page.mouse.move(hb.x+hb.width/2,hb.y+hb.height/2);
      await page.mouse.down();
      await page.waitForTimeout(1020);
      await page.mouse.up();
    }

    await expect(page.locator('.galaxy-reference')).toHaveClass(/phase-portrait/,{timeout:12000});
    await page.screenshot({path:testInfo.outputPath('galaxy-03-portrait.png'),fullPage:true});
    await page.getByRole('button',{name:'qo‘yib yubor'}).click();
    await expect(page.locator('.galaxy-reference')).toHaveClass(/phase-finale/,{timeout:8000});
    await page.screenshot({path:testInfo.outputPath('galaxy-04-finale.png'),fullPage:true});

    const viewport=await page.evaluate(()=>({
      innerHeight,
      doc:document.documentElement.scrollHeight,
      body:document.body.scrollHeight,
    }));
    expect(viewport.doc).toBeLessThanOrEqual(viewport.innerHeight+2);
    expect(viewport.body).toBeLessThanOrEqual(viewport.innerHeight+2);
    expect(errors).toEqual([]);
  });
});
