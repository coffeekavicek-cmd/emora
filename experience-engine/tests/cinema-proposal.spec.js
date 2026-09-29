import { test, expect } from '@playwright/test';

test.describe('Cinema Proposal dedicated film ritual',()=>{
  test('mobile recipient starts projector → scrubs film → reaches proposal question',async({page},testInfo)=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?template=proposal-cinema&name=Malika');
    await expect(page.locator('.cinema-proposal')).toBeVisible();
    await expect(page).toHaveTitle(/Cinema Proposal/);

    const viewport=await page.evaluate(()=>({h:innerHeight,doc:document.documentElement.scrollHeight,body:document.body.scrollHeight}));
    expect(viewport.doc).toBeLessThanOrEqual(viewport.h+2);
    expect(viewport.body).toBeLessThanOrEqual(viewport.h+2);
    await page.screenshot({path:testInfo.outputPath('01-cinema-theatre.png'),fullPage:true});

    await page.getByRole('button',{name:/Proyektorni yoqish/}).click();
    await expect(page.locator('.cinema-proposal')).toHaveClass(/phase-montage/,{timeout:2500});
    await expect(page.locator('.cinema-proposal')).toHaveClass(/phase-scrub/,{timeout:6000});

    const scrub=page.getByRole('button',{name:'Film lentasini o‘ngga suring'});
    const box=await scrub.boundingBox();expect(box).not.toBeNull();
    if(box){
      const x=box.x+20,y=box.y+box.height/2;
      await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+280,y,{steps:16});await page.mouse.up();
    }

    await expect(page.locator('.cinema-proposal')).toHaveClass(/phase-jam|phase-burn/,{timeout:4000});
    await page.screenshot({path:testInfo.outputPath('02-cinema-jam.png'),fullPage:true});
    await expect(page.locator('.cinema-proposal')).toHaveClass(/phase-question/,{timeout:7000});
    await expect(page.locator('.cp-question h2')).toContainText('ha');
    await expect(page.locator('.cp-question em')).toContainText('Malika');
    await page.screenshot({path:testInfo.outputPath('03-cinema-question.png'),fullPage:true});
    expect(errors).toEqual([]);
  });

  test('editor preview uses Cinema Proposal runtime',async({page})=>{
    await page.goto('/?mode=editor&template=proposal-cinema');
    await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.ce-phone-screen .cinema-proposal')).toBeVisible({timeout:10000});
    await expect(page.locator('.ce-phone-screen .cinematic')).toHaveCount(0);
  });
});
