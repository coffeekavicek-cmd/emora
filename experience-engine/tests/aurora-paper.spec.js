import { test, expect } from '@playwright/test';

test.describe('Aurora Paper dedicated birthday ritual',()=>{
  test('mobile recipient completes ribbon → layers → tear → aurora finale',async({page},testInfo)=>{
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});

    await page.goto('/?template=birthday-aurora&name=Malika');
    await expect(page.locator('.aurora-paper')).toBeVisible();
    await expect(page).toHaveTitle(/Aurora Paper/);

    const viewport=await page.evaluate(()=>({h:innerHeight,doc:document.documentElement.scrollHeight,body:document.body.scrollHeight}));
    expect(viewport.doc).toBeLessThanOrEqual(viewport.h+2);
    expect(viewport.body).toBeLessThanOrEqual(viewport.h+2);
    await page.screenshot({path:testInfo.outputPath('01-aurora-gift.png'),fullPage:true});

    const ribbon=page.getByRole('button',{name:'Lentani yechish'});
    const rb=await ribbon.boundingBox(); expect(rb).not.toBeNull();
    if(rb){
      const x=rb.x+25,y=rb.y+rb.height/2;
      await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+200,y,{steps:14});await page.mouse.up();
    }
    await expect(page.locator('.aurora-paper')).toHaveClass(/phase-layers/,{timeout:5000});
    await page.screenshot({path:testInfo.outputPath('02-aurora-layers.png'),fullPage:true});

    await page.getByRole('button',{name:/Keyingi qatlam/}).click();
    await page.getByRole('button',{name:/Keyingi qatlam/}).click();
    await page.getByRole('button',{name:/Oxirgi qog‘oz/}).click();
    await expect(page.locator('.aurora-paper')).toHaveClass(/phase-tear/,{timeout:4500});

    const tear=page.getByRole('button',{name:'Qog‘ozni yirtish'});
    const tb=await tear.boundingBox(); expect(tb).not.toBeNull();
    if(tb){
      const x=tb.x+25,y=tb.y+tb.height/2;
      await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+235,y,{steps:16});await page.mouse.up();
    }
    await expect(page.locator('.aurora-paper')).toHaveClass(/phase-finale/,{timeout:5000});
    await expect(page.locator('.ap-final-copy h2')).toContainText('Malika');
    await page.screenshot({path:testInfo.outputPath('03-aurora-finale.png'),fullPage:true});
    expect(errors).toEqual([]);
  });

  test('editor preview uses Aurora runtime',async({page})=>{
    await page.goto('/?mode=editor&template=birthday-aurora');
    await page.getByRole('button',{name:'Preview',exact:true}).click();
    await expect(page.locator('.ce-phone-screen .aurora-paper')).toBeVisible({timeout:10000});
    await expect(page.locator('.ce-phone-screen .cinematic')).toHaveCount(0);
  });
});
