import { test, expect } from '@playwright/test';

test.describe('Balloon Dream dedicated birthday ritual',()=>{
  test('mobile recipient releases balloons → holds hero → reaches sky finale',async({page},testInfo)=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?template=birthday-balloon&name=Malika');
    await expect(page.locator('.balloon-dream')).toBeVisible();
    await expect(page).toHaveTitle(/Balloon Dream/);

    const viewport=await page.evaluate(()=>({h:innerHeight,doc:document.documentElement.scrollHeight,body:document.body.scrollHeight}));
    expect(viewport.doc).toBeLessThanOrEqual(viewport.h+2);
    expect(viewport.body).toBeLessThanOrEqual(viewport.h+2);
    await page.screenshot({path:testInfo.outputPath('01-balloon-room.png'),fullPage:true});

    await page.getByRole('button',{name:'Birinchi sharni qo‘yib yuboring'}).click();
    await page.getByRole('button',{name:'Ikkinchi sharni qo‘yib yuboring'}).click();
    await page.getByRole('button',{name:'Uchinchi sharni qo‘yib yuboring'}).click();

    await expect(page.locator('.balloon-dream')).toHaveClass(/phase-hero/,{timeout:4000});
    await page.screenshot({path:testInfo.outputPath('02-balloon-hero.png'),fullPage:true});

    const hold=page.getByRole('button',{name:'Katta sharni bosib ushlab yoring'});
    await hold.focus();
    await page.keyboard.down('Enter');await page.waitForTimeout(1020);await page.keyboard.up('Enter');

    await expect(page.locator('.balloon-dream')).toHaveClass(/phase-silence|phase-finale/,{timeout:3000});
    await expect(page.locator('.balloon-dream')).toHaveClass(/phase-finale/,{timeout:3000});
    await expect(page.locator('.bd-finale h2')).toContainText('Malika');
    await page.screenshot({path:testInfo.outputPath('03-balloon-sky.png'),fullPage:true});
    expect(errors).toEqual([]);
  });

  test('editor preview uses Balloon Dream runtime',async({page})=>{
    await page.goto('/?mode=editor&template=birthday-balloon');
    await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.ce-phone-screen .balloon-dream')).toBeVisible({timeout:10000});
    await expect(page.locator('.ce-phone-screen .cinematic')).toHaveCount(0);
  });
});
