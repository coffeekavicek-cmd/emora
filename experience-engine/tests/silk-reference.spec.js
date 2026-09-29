import { test, expect } from '@playwright/test';

test.describe('Silk Heritage editorial reference',()=>{
  test('creator editor exposes wedding fields and Silk preview',async({page})=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?mode=editor&template=wedding-silk');
    await expect(page.locator('.creator-editor')).toBeVisible();
    await expect(page.getByText('Ismlar')).toBeVisible();
    await expect(page.getByText('Sana va vaqt')).toBeVisible();
    await expect(page.getByText('Joy nomi')).toBeVisible();

    await page.getByRole('button',{name:'Preview'}).click();
    await expect(page.locator('.ce-phone-screen .silk-heritage')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('recipient opens textile and navigates the editorial invitation',async({page},testInfo)=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?template=wedding-silk&couple=Aziz%20%26%20Dilnoza&venue=Silk%20Garden&address=Toshkent');
    const root=page.locator('.silk-heritage');
    await expect(root).toBeVisible();
    await expect(page).toHaveTitle(/Silk Heritage/);
    await page.screenshot({path:testInfo.outputPath('silk-01-cover.png'),fullPage:true});

    const veil=page.locator('.sh-veil');
    const vb=await veil.boundingBox();
    expect(vb).not.toBeNull();
    if(vb){
      const y=vb.y+vb.height*.55;
      await page.mouse.move(vb.x+vb.width*.88,y);
      await page.mouse.down();
      await page.mouse.move(vb.x+vb.width*.18,y,{steps:18});
      await page.mouse.up();
    }
    await expect(root).toHaveClass(/is-open/,{timeout:4000});
    await page.waitForTimeout(700);
    await page.screenshot({path:testInfo.outputPath('silk-02-reveal.png'),fullPage:true});

    await page.getByRole('button',{name:'2-sahifa'}).click();
    await expect(page.locator('.sh-letter')).toBeVisible();
    await page.waitForTimeout(700);

    await page.getByRole('button',{name:'3-sahifa'}).click();
    await expect(page.getByText('Silk Garden')).toBeVisible();
    await page.screenshot({path:testInfo.outputPath('silk-03-details.png'),fullPage:true});

    await page.getByRole('button',{name:'4-sahifa'}).click();
    await expect(page.getByText('Bu naqsh siz kelganingizda to‘liq bo‘ladi.')).toBeVisible();
    await page.getByRole('button',{name:'Albatta'}).click();
    await expect(page.getByText('Sizni kutamiz.')).toBeVisible();
    await page.screenshot({path:testInfo.outputPath('silk-04-presence.png'),fullPage:true});

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
