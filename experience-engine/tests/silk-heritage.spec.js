import { test, expect } from '@playwright/test';

test.describe('Silk Heritage dedicated ritual',()=>{
  test('mobile guest completes unfold → weave → knot → invitation',async({page},testInfo)=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?template=wedding-silk&name=Aziza&date=2026-10-10T18%3A00&venue=Silk%20Garden&address=Tashkent');
    await expect(page.locator('.silk-heritage')).toBeVisible();
    await expect(page).toHaveTitle(/Silk Heritage/);
    await page.screenshot({path:testInfo.outputPath('01-silk-opening.png'),fullPage:true});

    const viewport=await page.evaluate(()=>({
      innerHeight:window.innerHeight,
      scrollHeight:document.documentElement.scrollHeight,
      bodyScrollHeight:document.body.scrollHeight,
    }));
    expect(viewport.scrollHeight).toBeLessThanOrEqual(viewport.innerHeight+2);
    expect(viewport.bodyScrollHeight).toBeLessThanOrEqual(viewport.innerHeight+2);

    await page.getByRole('button',{name:/Taklifnomani ochish/}).click();
    await expect(page.locator('.silk-heritage')).toHaveClass(/phase-pull/);

    const pull=page.getByRole('button',{name:'Ipakni o‘ngga tortib oching'});
    const pb=await pull.boundingBox();
    expect(pb).not.toBeNull();
    if(pb){
      const x=pb.x+pb.width/2,y=pb.y+pb.height/2;
      await page.mouse.move(x,y);await page.mouse.down();
      await page.mouse.move(x+210,y,{steps:16});await page.mouse.up();
    }

    await expect(page.locator('.silk-heritage')).toHaveClass(/phase-weave/,{timeout:4000});
    await expect(page.locator('.sh-embroidery')).toBeVisible();
    await page.screenshot({path:testInfo.outputPath('02-silk-weave.png'),fullPage:true});

    await expect(page.locator('.silk-heritage')).toHaveClass(/phase-knot/,{timeout:6500});
    const knot=page.getByRole('button',{name:'Oltin iplarni birlashtiring'});
    const kb=await knot.boundingBox();
    expect(kb).not.toBeNull();
    if(kb){
      const x=kb.x+kb.width/2,y=kb.y+kb.height/2;
      await page.mouse.move(x,y);await page.mouse.down();
      await page.mouse.move(x+170,y,{steps:14});await page.mouse.up();
    }

    await expect(page.locator('.silk-heritage')).toHaveClass(/phase-finale/,{timeout:4500});
    await expect(page.locator('.sh-invite')).toBeVisible();
    await expect(page.locator('.sh-event')).toContainText('Silk Garden');
    await expect(page.getByRole('button',{name:'Kalendar +'})).toBeVisible();
    await expect(page.getByRole('link',{name:'Xaritada ochish ↗'})).toBeVisible();
    await page.screenshot({path:testInfo.outputPath('03-silk-finale.png'),fullPage:true});
    expect(errors).toEqual([]);
  });

  test('editor preview uses Silk runtime',async({page})=>{
    await page.goto('/?mode=editor&template=wedding-silk');
    await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.ce-phone-screen .silk-heritage')).toBeVisible({timeout:10000});
    await expect(page.locator('.ce-phone-screen .cinematic')).toHaveCount(0);
    await expect(page.locator('.ce-phone-screen .pearl-motion')).toHaveCount(0);
  });
});
